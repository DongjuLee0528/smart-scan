"""
Unit tests for inbound-scanner services/scan_service.py

Run: PYTHONPATH=lambdas/inbound-scanner pytest lambdas/inbound-scanner/tests/ -v
"""
import json
import time
import pytest
from unittest.mock import patch, MagicMock


@pytest.fixture(autouse=True)
def reset_cooldown():
    """각 테스트 전후 모듈 레벨 상태 초기화 (쿨다운 + 외출 태그 기록)."""
    import services.scan_service as svc
    svc._last_notified.clear()
    svc._last_outbound_tags.clear()
    yield
    svc._last_notified.clear()
    svc._last_outbound_tags.clear()


def _make_event(body: dict) -> dict:
    return {"body": json.dumps(body)}


# ── test_missing_device_serial ────────────────────────────────────────────────

def test_missing_device_serial():
    """device_serial이 없으면 400을 반환해야 한다."""
    from services.scan_service import process_scan

    response = process_scan(_make_event({"tags": ["TAG001"]}))

    assert response["statusCode"] == 400
    assert "device_serial" in json.loads(response["body"])["message"]


# ── test_invalid_tags_type ────────────────────────────────────────────────────

@patch("services.scan_service.get_device_by_serial", return_value={"id": 42})
@patch("services.scan_service._insert_scan_logs")
def test_invalid_tags_type(mock_logs, mock_device):
    """tags가 list가 아니면 400을 반환해야 한다."""
    from services.scan_service import process_scan

    response = process_scan(_make_event({"device_serial": "SN-001", "tags": "TAG001"}))

    assert response["statusCode"] == 400
    assert json.loads(response["body"])["message"] == "tags must be an array."


# ── test_device_not_found ─────────────────────────────────────────────────────

@patch("services.scan_service.get_device_by_serial", return_value=None)
def test_device_not_found(mock_device):
    """등록되지 않은 디바이스이면 400을 반환해야 한다."""
    from services.scan_service import process_scan

    response = process_scan(_make_event({"device_serial": "SN-9999", "tags": []}))

    assert response["statusCode"] == 400
    mock_device.assert_called_once_with("SN-9999")


# ── test_no_missing_items ─────────────────────────────────────────────────────

@patch("services.scan_service.lambda_client")
@patch("services.scan_service.check_missing_items_rpc", return_value=[])
@patch("services.scan_service._insert_scan_logs")
@patch("services.scan_service.get_device_by_serial", return_value={"id": 42})
def test_no_missing_items(mock_device, mock_logs, mock_rpc, mock_lambda):
    """누락 물건이 없으면 outbound를 invoke하지 않고 200을 반환해야 한다."""
    from services.scan_service import process_scan

    response = process_scan(_make_event({"device_serial": "SN-001", "tags": ["TAG001"]}))

    assert response["statusCode"] == 200
    assert json.loads(response["body"])["message"] == "All items confirmed."
    mock_lambda.invoke.assert_not_called()


# ── test_missing_items_invokes_outbound ───────────────────────────────────────

@patch("services.scan_service.lambda_client")
@patch(
    "services.scan_service.check_missing_items_rpc",
    return_value=[{
        "member_id": 1, "member_name": "홍길동",
        "member_email": "test@test.com", "missing_item": "지갑"
    }],
)
@patch("services.scan_service._insert_scan_logs")
@patch("services.scan_service.get_device_by_serial", return_value={"id": 42})
def test_missing_items_invokes_outbound(mock_device, mock_logs, mock_rpc, mock_lambda):
    """누락 물건이 있으면 outbound Lambda를 invoke하고 200을 반환해야 한다."""
    from services.scan_service import process_scan

    response = process_scan(_make_event({"device_serial": "SN-001", "tags": []}))

    assert response["statusCode"] == 200
    assert "지갑" in json.loads(response["body"])["message"]
    mock_lambda.invoke.assert_called_once()
    kwargs = mock_lambda.invoke.call_args.kwargs
    assert kwargs["FunctionName"] == "smartscan-outbound"
    assert kwargs["InvocationType"] == "Event"


# ── test_outbound_failure_doesnt_affect_response ──────────────────────────────

@patch("services.scan_service.lambda_client")
@patch(
    "services.scan_service.check_missing_items_rpc",
    return_value=[{
        "member_id": 1, "member_name": "홍길동",
        "member_email": "test@test.com", "missing_item": "지갑"
    }],
)
@patch("services.scan_service._insert_scan_logs")
@patch("services.scan_service.get_device_by_serial", return_value={"id": 42})
def test_outbound_failure_doesnt_affect_response(mock_device, mock_logs, mock_rpc, mock_lambda):
    """outbound invoke 실패해도 200을 반환해야 한다."""
    from services.scan_service import process_scan

    mock_lambda.invoke.side_effect = Exception("Connection timeout")

    response = process_scan(_make_event({"device_serial": "SN-001", "tags": []}))

    assert response["statusCode"] == 200


# ── test_invalid_body_json ────────────────────────────────────────────────────

def test_invalid_body_json():
    """잘못된 JSON body이면 400을 반환해야 한다."""
    from services.scan_service import process_scan

    response = process_scan({"body": "not-json"})

    assert response["statusCode"] == 400


# ── 멤버별 쿨다운 테스트 ─────────────────────────────────────────────────────

MEMBER_A = {"member_id": 1, "member_name": "홍길동", "member_email": "a@test.com", "missing_item": "지갑"}
MEMBER_B = {"member_id": 2, "member_name": "김철수", "member_email": "b@test.com", "missing_item": "열쇠"}


@patch("services.scan_service.lambda_client")
@patch("services.scan_service.check_missing_items_rpc", return_value=[MEMBER_A])
@patch("services.scan_service._insert_scan_logs")
@patch("services.scan_service.get_device_by_serial", return_value={"id": 42})
def test_cooldown_blocks_same_member(mock_device, mock_logs, mock_rpc, mock_lambda):
    """같은 멤버가 60초 이내 재통과하면 두 번째 outbound는 호출하지 않는다."""
    import services.scan_service as svc
    from services.scan_service import process_scan

    process_scan(_make_event({"device_serial": "SN-001", "tags": ["TAG001"]}))
    assert mock_lambda.invoke.call_count == 1

    # 쿨다운 중 재통과
    process_scan(_make_event({"device_serial": "SN-001", "tags": []}))
    assert mock_lambda.invoke.call_count == 1  # 추가 호출 없음


@patch("services.scan_service.lambda_client")
@patch("services.scan_service._insert_scan_logs")
@patch("services.scan_service.get_device_by_serial", return_value={"id": 42})
def test_sequential_two_members_both_notified(mock_device, mock_logs, mock_lambda):
    """A 통과 후 60초 이내에 B 통과 → 멤버별 쿨다운이므로 B도 outbound 호출."""
    from services.scan_service import process_scan

    with patch("services.scan_service.check_missing_items_rpc", return_value=[MEMBER_A]):
        process_scan(_make_event({"device_serial": "SN-001", "tags": ["TAG_A"]}))

    assert mock_lambda.invoke.call_count == 1
    payload_a = json.loads(mock_lambda.invoke.call_args_list[0].kwargs["Payload"])
    assert payload_a["missing_by_member"][0]["member_id"] == 1

    with patch("services.scan_service.check_missing_items_rpc", return_value=[MEMBER_B]):
        process_scan(_make_event({"device_serial": "SN-001", "tags": ["TAG_B"]}))

    # B는 쿨다운 대상 아니므로 outbound 추가 호출
    assert mock_lambda.invoke.call_count == 2
    payload_b = json.loads(mock_lambda.invoke.call_args_list[1].kwargs["Payload"])
    assert payload_b["missing_by_member"][0]["member_id"] == 2


@patch("services.scan_service.lambda_client")
@patch(
    "services.scan_service.check_missing_items_rpc",
    return_value=[MEMBER_A, MEMBER_B],
)
@patch("services.scan_service._insert_scan_logs")
@patch("services.scan_service.get_device_by_serial", return_value={"id": 42})
def test_simultaneous_two_members_single_outbound(mock_device, mock_logs, mock_rpc, mock_lambda):
    """A, B가 동시 통과 → outbound 1회 호출에 두 멤버 모두 포함."""
    from services.scan_service import process_scan

    process_scan(_make_event({"device_serial": "SN-001", "tags": ["TAG_A", "TAG_B"]}))

    assert mock_lambda.invoke.call_count == 1
    payload = json.loads(mock_lambda.invoke.call_args.kwargs["Payload"])
    member_ids = {m["member_id"] for m in payload["missing_by_member"]}
    assert member_ids == {1, 2}


@patch("services.scan_service.lambda_client")
@patch("services.scan_service.check_missing_items_rpc", return_value=[MEMBER_A])
@patch("services.scan_service._insert_scan_logs")
@patch("services.scan_service.get_device_by_serial", return_value={"id": 42})
def test_cooldown_expires_member_notified_again(mock_device, mock_logs, mock_rpc, mock_lambda):
    """쿨다운 만료 후 같은 멤버가 재통과하면 outbound를 다시 호출한다."""
    import services.scan_service as svc
    from services.scan_service import process_scan

    process_scan(_make_event({"device_serial": "SN-001", "tags": []}))
    assert mock_lambda.invoke.call_count == 1

    # 쿨다운 강제 만료
    svc._last_notified[MEMBER_A["member_id"]] = time.time() - svc.NOTIFY_COOLDOWN_SEC - 1

    process_scan(_make_event({"device_serial": "SN-001", "tags": []}))
    assert mock_lambda.invoke.call_count == 2


# ── 귀가 시나리오 테스트 ─────────────────────────────────────────────────────

LEFT_ITEM = {"item_name": "차키", "tag_uid": "TAG_KEY", "member_id": 1, "member_name": "홍길동", "member_email": "a@test.com"}


@patch("services.scan_service.lambda_client")
@patch("services.scan_service.get_items_by_tags", return_value=[LEFT_ITEM])
@patch("services.scan_service.check_missing_items_rpc", return_value=[])
@patch("services.scan_service._insert_scan_logs")
@patch("services.scan_service.get_device_by_serial", return_value={"id": 42})
def test_return_home_detected_after_outbound(mock_device, mock_logs, mock_rpc, mock_items, mock_lambda):
    """외출 후 같은 태그로 재진입 시 귀가 판정, return_home 알림 발송."""
    from services.scan_service import process_scan

    # 외출: TAG_WALLET + TAG_KEY 스캔
    process_scan(_make_event({"device_serial": "SN-001", "tags": ["TAG_WALLET", "TAG_KEY"]}))
    assert mock_lambda.invoke.call_count == 0  # 누락 없음

    # 귀가: TAG_WALLET만 들고 옴 (TAG_KEY는 밖에 두고 옴)
    process_scan(_make_event({"device_serial": "SN-001", "tags": ["TAG_WALLET"]}))

    assert mock_lambda.invoke.call_count == 1
    payload = json.loads(mock_lambda.invoke.call_args.kwargs["Payload"])
    assert payload["alert_type"] == "return_home"
    assert len(payload["left_items_by_member"]) == 1
    assert payload["left_items_by_member"][0]["left_items"] == ["차키"]


@patch("services.scan_service.lambda_client")
@patch("services.scan_service.check_missing_items_rpc", return_value=[])
@patch("services.scan_service._insert_scan_logs")
@patch("services.scan_service.get_device_by_serial", return_value={"id": 42})
def test_return_home_all_items_returned_no_alert(mock_device, mock_logs, mock_rpc, mock_lambda):
    """귀가 시 모든 물건 들고 오면 알림 없이 200 반환."""
    from services.scan_service import process_scan

    # 외출: TAG_A
    process_scan(_make_event({"device_serial": "SN-001", "tags": ["TAG_A"]}))

    # 귀가: TAG_A 그대로 들고 옴 → left_outside_tags 없음
    response = process_scan(_make_event({"device_serial": "SN-001", "tags": ["TAG_A"]}))

    assert response["statusCode"] == 200
    assert json.loads(response["body"])["message"] == "Return home processed."
    mock_lambda.invoke.assert_not_called()


@patch("services.scan_service.lambda_client")
@patch("services.scan_service.check_missing_items_rpc", return_value=[MEMBER_A])
@patch("services.scan_service._insert_scan_logs")
@patch("services.scan_service.get_device_by_serial", return_value={"id": 42})
def test_outbound_scan_inserts_found_logs(mock_device, mock_logs, mock_rpc, mock_lambda):
    """외출 스캔 시 _insert_scan_logs에 status='FOUND' 전달."""
    from services.scan_service import process_scan

    process_scan(_make_event({"device_serial": "SN-001", "tags": ["TAG001"]}))

    mock_logs.assert_called_once_with(42, ["TAG001"], status='FOUND')


@patch("services.scan_service.lambda_client")
@patch("services.scan_service.get_items_by_tags", return_value=[])
@patch("services.scan_service.check_missing_items_rpc", return_value=[])
@patch("services.scan_service._insert_scan_logs")
@patch("services.scan_service.get_device_by_serial", return_value={"id": 42})
def test_return_home_inserts_returned_logs(mock_device, mock_logs, mock_rpc, mock_items, mock_lambda):
    """귀가 스캔 시 _insert_scan_logs에 status='RETURNED' 전달."""
    from services.scan_service import process_scan

    # 외출
    process_scan(_make_event({"device_serial": "SN-001", "tags": ["TAG001"]}))
    # 귀가
    process_scan(_make_event({"device_serial": "SN-001", "tags": ["TAG001"]}))

    # 두 번째 호출이 RETURNED
    calls = mock_logs.call_args_list
    assert calls[1] == ((42, ["TAG001"]), {"status": "RETURNED"})
