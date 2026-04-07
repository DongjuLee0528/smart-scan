"""
Unit tests for remote_service.py

PYTHONPATH 설정 예시:
    PYTHONPATH=lambdas/remote-alert pytest lambdas/remote-alert/tests/
"""
import json
import unittest
from unittest.mock import MagicMock, patch

# ---------------------------------------------------------------------------
# 헬퍼 — 공통 이벤트 빌더
# ---------------------------------------------------------------------------

def _make_event(method="POST", auth="Bearer valid-token", body: dict | None = None):
    return {
        "httpMethod": method,
        "headers": {"Authorization": auth} if auth else {},
        "body": json.dumps(body) if body is not None else None,
    }


def _mock_supabase(user_obj=True, member_data=None, insert_raises=False):
    """
    get_client() 가 반환하는 Supabase 클라이언트 mock 생성.

    - user_obj=True  → auth.get_user() 성공 (user 속성 존재)
    - user_obj=False → auth.get_user() 가 ValueError 발생
    - member_data    → family_members 쿼리 결과 (None 이면 data=None)
    - insert_raises  → notifications INSERT 에서 예외 발생
    """
    client = MagicMock()

    # --- auth.get_user ---
    if user_obj:
        user_response = MagicMock()
        user_response.user = MagicMock()
        client.auth.get_user.return_value = user_response
    else:
        client.auth.get_user.side_effect = ValueError("invalid token")

    # --- family_members 체인: .table().select().eq().single().execute() ---
    member_result = MagicMock()
    member_result.data = member_data
    (client.table.return_value
           .select.return_value
           .eq.return_value
           .single.return_value
           .execute.return_value) = member_result

    # --- notifications INSERT 체인: .table().insert().execute() ---
    insert_chain = (client.table.return_value
                          .insert.return_value
                          .execute)
    if insert_raises:
        insert_chain.side_effect = Exception("DB insert error")
    else:
        insert_chain.return_value = MagicMock()

    return client


# ---------------------------------------------------------------------------
# 테스트 클래스
# ---------------------------------------------------------------------------

class TestSendRemoteAlert(unittest.TestCase):

    # 1. OPTIONS 프리플라이트 → 200
    def test_options_returns_200(self):
        from services.remote_service import send_remote_alert

        event = _make_event(method="OPTIONS")
        resp = send_remote_alert(event)

        self.assertEqual(resp["statusCode"], 200)
        self.assertEqual(resp["body"], "")

    # 2. Authorization 헤더 없음 → 401
    def test_no_auth_header_returns_401(self):
        from services.remote_service import send_remote_alert

        event = _make_event(auth=None)
        resp = send_remote_alert(event)

        self.assertEqual(resp["statusCode"], 401)
        body = json.loads(resp["body"])
        self.assertIn("error", body)

    # 3. 토큰 검증 실패(get_user 예외) → 401
    @patch("services.remote_service.get_client")
    def test_invalid_token_returns_401(self, mock_get_client):
        from services.remote_service import send_remote_alert

        mock_get_client.return_value = _mock_supabase(user_obj=False)
        event = _make_event(body={"member_id": 1, "message": "hi"})
        resp = send_remote_alert(event)

        self.assertEqual(resp["statusCode"], 401)
        body = json.loads(resp["body"])
        self.assertIn("error", body)

    # 4. member_id 누락 → 400
    @patch("services.remote_service.get_client")
    def test_missing_member_id_returns_400(self, mock_get_client):
        from services.remote_service import send_remote_alert

        mock_get_client.return_value = _mock_supabase()
        event = _make_event(body={"message": "hello"})
        resp = send_remote_alert(event)

        self.assertEqual(resp["statusCode"], 400)
        body = json.loads(resp["body"])
        self.assertIn("error", body)

    # 5. DB에서 가족 구성원 없음 → 404
    @patch("services.remote_service.get_client")
    def test_member_not_found_returns_404(self, mock_get_client):
        from services.remote_service import send_remote_alert

        # member_data=None → result.data 가 None
        mock_get_client.return_value = _mock_supabase(member_data=None)
        event = _make_event(body={"member_id": 99, "message": "hello"})
        resp = send_remote_alert(event)

        self.assertEqual(resp["statusCode"], 404)
        body = json.loads(resp["body"])
        self.assertIn("error", body)

    # 6. send_email 실패 → 500
    @patch("services.remote_service.send_email", return_value=False)
    @patch("services.remote_service.get_client")
    def test_email_failure_returns_500(self, mock_get_client, mock_send_email):
        from services.remote_service import send_remote_alert

        mock_get_client.return_value = _mock_supabase(
            member_data={"email": "test@example.com", "name": "홍길동"}
        )
        event = _make_event(body={"member_id": 1, "message": "긴급 알림"})
        resp = send_remote_alert(event)

        self.assertEqual(resp["statusCode"], 500)
        body = json.loads(resp["body"])
        self.assertIn("error", body)
        mock_send_email.assert_called_once()

    # 7. 정상 흐름 → 200, success: True
    @patch("services.remote_service.send_email", return_value=True)
    @patch("services.remote_service.get_client")
    def test_success_returns_200(self, mock_get_client, mock_send_email):
        from services.remote_service import send_remote_alert

        mock_get_client.return_value = _mock_supabase(
            member_data={"email": "member@example.com", "name": "김철수"}
        )
        event = _make_event(body={"member_id": 1, "message": "안녕하세요"})
        resp = send_remote_alert(event)

        self.assertEqual(resp["statusCode"], 200)
        body = json.loads(resp["body"])
        self.assertTrue(body.get("success"))
        self.assertIn("김철수", body.get("message", ""))
        mock_send_email.assert_called_once()

    # 8. notifications INSERT 예외가 발생해도 최종 응답은 200
    @patch("services.remote_service.send_email", return_value=True)
    @patch("services.remote_service.get_client")
    def test_db_failure_doesnt_affect_success(self, mock_get_client, mock_send_email):
        from services.remote_service import send_remote_alert

        mock_get_client.return_value = _mock_supabase(
            member_data={"email": "member@example.com", "name": "이영희"},
            insert_raises=True,
        )
        event = _make_event(body={"member_id": 2, "message": "테스트 메시지"})
        resp = send_remote_alert(event)

        # INSERT 실패해도 이메일 발송 성공이면 200
        self.assertEqual(resp["statusCode"], 200)
        body = json.loads(resp["body"])
        self.assertTrue(body.get("success"))


if __name__ == "__main__":
    unittest.main()
