"""
Unit tests for outbound-notifier services/notify_service.py

PYTHONPATH setting assumption: lambdas/outbound-notifier/
Execute: pytest lambdas/outbound-notifier/tests/
"""
import pytest
from unittest.mock import patch, MagicMock


# ---------------------------------------------------------------------------
# Helper: Create basic member dict
# ---------------------------------------------------------------------------

def _make_member(
    member_id=1,
    member_name="John Doe",
    member_email="hong@example.com",
    missing_items=None,
):
    return {
        "member_id": member_id,
        "member_name": member_name,
        "member_email": member_email,
        "missing_items": missing_items if missing_items is not None else ["item_a"],
    }


# ---------------------------------------------------------------------------
# test_empty_members_returns_skip
# ---------------------------------------------------------------------------

def test_empty_members_returns_skip():
    """Should return skip status when missing_by_member is an empty list."""
    from services.notify_service import send_missing_alert

    result = send_missing_alert({"missing_by_member": []})

    assert result["status"] == "skip"


# ---------------------------------------------------------------------------
# test_no_email_skipped
# ---------------------------------------------------------------------------

@patch("services.notify_service.get_client")
@patch("services.notify_service.send_email")
def test_no_email_skipped(mock_send_email, mock_get_client):
    """Should skip the member when member_email is missing."""
    from services.notify_service import send_missing_alert

    member = _make_member(member_email=None)
    result = send_missing_alert({"missing_by_member": [member]})

    assert result["status"] == "ok"
    assert result["details"][0]["status"] == "skipped"
    mock_send_email.assert_not_called()


# ---------------------------------------------------------------------------
# test_no_items_skipped
# ---------------------------------------------------------------------------

@patch("services.notify_service.get_client")
@patch("services.notify_service.send_email")
def test_no_items_skipped(mock_send_email, mock_get_client):
    """Should skip the member when missing_items is an empty list."""
    from services.notify_service import send_missing_alert

    member = _make_member(missing_items=[])
    result = send_missing_alert({"missing_by_member": [member]})

    assert result["status"] == "ok"
    assert result["details"][0]["status"] == "skipped"
    mock_send_email.assert_not_called()


# ---------------------------------------------------------------------------
# test_email_sent_success
# ---------------------------------------------------------------------------

@patch("services.notify_service.get_client")
@patch("services.notify_service.send_email", return_value=True)
def test_email_sent_success(mock_send_email, mock_get_client):
    """Should have status 'sent' when send_email returns True."""
    from services.notify_service import send_missing_alert

    mock_supabase = MagicMock()
    mock_get_client.return_value = mock_supabase

    member = _make_member()
    result = send_missing_alert({"missing_by_member": [member]})

    assert result["status"] == "ok"
    assert result["sent"] == 1
    assert result["details"][0]["status"] == "sent"
    mock_send_email.assert_called_once()


# ---------------------------------------------------------------------------
# test_email_failed
# ---------------------------------------------------------------------------

@patch("services.notify_service.get_client")
@patch("services.notify_service.send_email", return_value=False)
def test_email_failed(mock_send_email, mock_get_client):
    """Should have status 'email_failed' when send_email returns False."""
    from services.notify_service import send_missing_alert

    mock_supabase = MagicMock()
    mock_get_client.return_value = mock_supabase

    member = _make_member()
    result = send_missing_alert({"missing_by_member": [member]})

    assert result["status"] == "ok"
    assert result["sent"] == 0
    assert result["details"][0]["status"] == "email_failed"


# ---------------------------------------------------------------------------
# test_db_failure_doesnt_affect_result
# ---------------------------------------------------------------------------

@patch("services.notify_service.get_client")
@patch("services.notify_service.send_email", return_value=True)
def test_db_failure_doesnt_affect_result(mock_send_email, mock_get_client):
    """Should still have result 'sent' even when DB insert throws an exception."""
    from services.notify_service import send_missing_alert

    mock_supabase = MagicMock()
    mock_supabase.table.return_value.insert.return_value.execute.side_effect = Exception(
        "DB connection error"
    )
    mock_get_client.return_value = mock_supabase

    member = _make_member()
    result = send_missing_alert({"missing_by_member": [member]})

    assert result["status"] == "ok"
    assert result["details"][0]["status"] == "sent"


# ---------------------------------------------------------------------------
# test_xss_escape
# ---------------------------------------------------------------------------

@patch("services.notify_service.get_client")
@patch("services.notify_service.send_email", return_value=True)
def test_xss_escape(mock_send_email, mock_get_client):
    """Should apply HTML escaping when member_name contains <script> tags."""
    from services.notify_service import send_missing_alert

    mock_supabase = MagicMock()
    mock_get_client.return_value = mock_supabase

    member = _make_member(member_name="<script>alert('xss')</script>")
    send_missing_alert({"missing_by_member": [member]})

    # Check the HTML body passed to send_email
    call_args = mock_send_email.call_args
    html_body = call_args[0][2]  # positional: (recipients, subject, html)

    assert "<script>" not in html_body
    assert "&lt;script&gt;" in html_body


# ---------------------------------------------------------------------------
# test_multiple_members
# ---------------------------------------------------------------------------

@patch("services.notify_service.get_client")
@patch("services.notify_service.send_email")
def test_multiple_members(mock_send_email, mock_get_client):
    """Should correctly calculate sent_count based on send_email results when processing 2 members."""
    from services.notify_service import send_missing_alert

    mock_supabase = MagicMock()
    mock_get_client.return_value = mock_supabase

    # First member: email success, second member: email failure
    mock_send_email.side_effect = [True, False]

    members = [
        _make_member(member_id=1, member_email="user1@example.com"),
        _make_member(member_id=2, member_email="user2@example.com"),
    ]
    result = send_missing_alert({"missing_by_member": members})

    assert result["status"] == "ok"
    assert result["total"] == 2
    assert result["sent"] == 1
    assert result["details"][0]["status"] == "sent"
    assert result["details"][1]["status"] == "email_failed"
    assert mock_send_email.call_count == 2
