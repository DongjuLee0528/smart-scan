"""
Unit tests for remote_service.py

PYTHONPATH setting example:
    PYTHONPATH=lambdas/remote-alert pytest lambdas/remote-alert/tests/
"""
import json
import unittest
from unittest.mock import MagicMock, patch

# ---------------------------------------------------------------------------
# Helper — Common event builder
# ---------------------------------------------------------------------------

def _make_event(method="POST", auth="Bearer valid-token", body: dict | None = None):
    return {
        "httpMethod": method,
        "headers": {"Authorization": auth} if auth else {},
        "body": json.dumps(body) if body is not None else None,
    }


def _mock_supabase(user_obj=True, member_data=None, insert_raises=False):
    """Create a mocked Supabase client returned by get_client()

    - user_obj=True  → auth.get_user() succeeds (user property exists)
    - user_obj=False → auth.get_user() raises ValueError
    - member_data    → family_members query result (data=None if None)
    - insert_raises  → notifications INSERT raises exception
    """
    client = MagicMock()

    # --- auth.get_user ---
    if user_obj:
        user_response = MagicMock()
        user_response.user = MagicMock()
        client.auth.get_user.return_value = user_response
    else:
        client.auth.get_user.side_effect = ValueError("invalid token")

    # --- family_members chain: .table().select().eq().single().execute() ---
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
# Test class
# ---------------------------------------------------------------------------

class TestSendRemoteAlert(unittest.TestCase):

    # 1. OPTIONS preflight → 200
    def test_options_returns_200(self):
        from services.remote_service import send_remote_alert

        event = _make_event(method="OPTIONS")
        resp = send_remote_alert(event)

        self.assertEqual(resp["statusCode"], 200)
        self.assertEqual(resp["body"], "")

    # 2. No Authorization header → 401
    def test_no_auth_header_returns_401(self):
        from services.remote_service import send_remote_alert

        event = _make_event(auth=None)
        resp = send_remote_alert(event)

        self.assertEqual(resp["statusCode"], 401)
        body = json.loads(resp["body"])
        self.assertIn("error", body)

    # 3. Token validation failure (get_user exception) → 401
    @patch("services.remote_service.get_client")
    def test_invalid_token_returns_401(self, mock_get_client):
        from services.remote_service import send_remote_alert

        mock_get_client.return_value = _mock_supabase(user_obj=False)
        event = _make_event(body={"member_id": 1, "message": "hi"})
        resp = send_remote_alert(event)

        self.assertEqual(resp["statusCode"], 401)
        body = json.loads(resp["body"])
        self.assertIn("error", body)

    # 4. Missing member_id → 400
    @patch("services.remote_service.get_client")
    def test_missing_member_id_returns_400(self, mock_get_client):
        from services.remote_service import send_remote_alert

        mock_get_client.return_value = _mock_supabase()
        event = _make_event(body={"message": "hello"})
        resp = send_remote_alert(event)

        self.assertEqual(resp["statusCode"], 400)
        body = json.loads(resp["body"])
        self.assertIn("error", body)

    # 5. No family member found in DB → 404
    @patch("services.remote_service.get_client")
    def test_member_not_found_returns_404(self, mock_get_client):
        from services.remote_service import send_remote_alert

        # member_data=None → result.data is None
        mock_get_client.return_value = _mock_supabase(member_data=None)
        event = _make_event(body={"member_id": 99, "message": "hello"})
        resp = send_remote_alert(event)

        self.assertEqual(resp["statusCode"], 404)
        body = json.loads(resp["body"])
        self.assertIn("error", body)

    # 6. send_email failure → 500
    @patch("services.remote_service.send_email", return_value=False)
    @patch("services.remote_service.get_client")
    def test_email_failure_returns_500(self, mock_get_client, mock_send_email):
        from services.remote_service import send_remote_alert

        mock_get_client.return_value = _mock_supabase(
            member_data={"email": "test@example.com", "name": "Hong Gildong"}
        )
        event = _make_event(body={"member_id": 1, "message": "Emergency alert"})
        resp = send_remote_alert(event)

        self.assertEqual(resp["statusCode"], 500)
        body = json.loads(resp["body"])
        self.assertIn("error", body)
        mock_send_email.assert_called_once()

    # 7. Normal flow → 200, success: True
    @patch("services.remote_service.send_email", return_value=True)
    @patch("services.remote_service.get_client")
    def test_success_returns_200(self, mock_get_client, mock_send_email):
        from services.remote_service import send_remote_alert

        mock_get_client.return_value = _mock_supabase(
            member_data={"email": "member@example.com", "name": "Kim Cheolsu"}
        )
        event = _make_event(body={"member_id": 1, "message": "Hello"})
        resp = send_remote_alert(event)

        self.assertEqual(resp["statusCode"], 200)
        body = json.loads(resp["body"])
        self.assertTrue(body.get("success"))
        self.assertIn("Kim Cheolsu", body.get("message", ""))
        mock_send_email.assert_called_once()

    # 8. Final response is 200 even if notifications INSERT exception occurs
    @patch("services.remote_service.send_email", return_value=True)
    @patch("services.remote_service.get_client")
    def test_db_failure_doesnt_affect_success(self, mock_get_client, mock_send_email):
        from services.remote_service import send_remote_alert

        mock_get_client.return_value = _mock_supabase(
            member_data={"email": "member@example.com", "name": "Lee Younghee"},
            insert_raises=True,
        )
        event = _make_event(body={"member_id": 2, "message": "Test message"})
        resp = send_remote_alert(event)

        # Even if INSERT fails, 200 if email send succeeds
        self.assertEqual(resp["statusCode"], 200)
        body = json.loads(resp["body"])
        self.assertTrue(body.get("success"))


if __name__ == "__main__":
    unittest.main()
