"""
Notification Service for Outbound Notifier Lambda

Handles sending email alerts for missing items and return home scenarios.
Manages HTML email template generation and notification database logging.

Key Features:
- Missing item alert emails with member-specific content
- Return home notifications for items left outside
- HTML email template generation with XSS protection
- Notification record storage in Supabase database
- Member-specific email personalization
"""

from html import escape

from common.db import get_client
from common.email_client import send_email


def send_return_home_alert(event) -> dict:
    """Send email alerts for items left outside when returning home

    Processes return home events and sends personalized email notifications
    to family members about items they left outside.

    Args:
        event: Event data containing information about items left outside

    Event format:
    {
      "alert_type": "return_home",
      "left_items_by_member": [
        {
          "member_id": 1,
          "member_name": "John Doe",
          "member_email": "john@example.com",
          "left_items": ["car keys", "wallet"]
        }
      ]
    }

    Returns:
        dict: Processing results with status and delivery details
    """
    members = event.get('left_items_by_member', [])
    if not members:
        return {"status": "skip", "message": "No alert targets"}

    results = []
    for member in members:
        member_id = member.get('member_id')
        member_name = member.get('member_name', 'Member')
        member_email = member.get('member_email')
        left_items = member.get('left_items', [])

        if not member_email or not left_items:
            results.append({"member_id": member_id, "status": "skipped", "reason": "No email or items"})
            continue

        safe_name = escape(str(member_name))
        items_html = ''.join(
            [f'<li style="margin:8px 0;font-size:15px"><strong>{escape(str(item))}</strong></li>'
             for item in left_items]
        )
        html = f"""
        <div style="font-family:'Apple SD Gothic Neo',sans-serif;max-width:480px;margin:auto;padding:24px">
          <h2 style="color:#034EA2;margin-bottom:8px">&#x1F3E0; SmartScan Hub Alert</h2>
          <p style="font-size:16px;margin-bottom:20px">
            <strong>{safe_name}</strong>, welcome home!<br>You left some items outside.
          </p>
          <ul style="background:#fff3cd;padding:16px 24px;border-radius:8px;list-style:none">
            {items_html}
          </ul>
          <p style="color:#718096;font-size:12px;margin-top:20px">This email was automatically sent by SmartScan Hub.</p>
        </div>
        """

        subject = f"[SmartScan Hub] {safe_name}, you left some items outside!"
        ok = send_email([member_email], subject, html)
        status = "sent" if ok else "email_failed"
        print(f"[RETURN_HOME_ALERT][{status}] {member_name} ({member_email}) → left outside: {left_items}")

        results.append({"member_id": member_id, "status": status})

    sent_count = sum(1 for r in results if r["status"] == "sent")
    return {"status": "ok", "total": len(results), "sent": sent_count, "details": results}


def send_missing_alert(event) -> dict:
    """
    Processes missing item alerts received through direct invocation (payload)
    from inbound-scanner Lambda.

    Event format:
    {
      "missing_by_member": [
        {
          "member_id": 1,
          "member_name": "John Doe",
          "member_email": "user@example.com",
          "missing_items": ["wallet", "keys"]
        },
        ...
      ]
    }
    """
    # Delivered from inbound-scanner Lambda in {'missing_by_member': [...]} format
    members = event.get('missing_by_member', [])
    if not members:
        return {"status": "skip", "message": "No alert targets"}

    supabase = get_client()
    results = []

    for member in members:
        member_id = member.get('member_id')
        member_name = member.get('member_name', 'Member')
        member_email = member.get('member_email')
        missing_items = member.get('missing_items', [])

        if not member_id or not missing_items or not member_email:
            results.append({
                "member_id": member_id,
                "status": "skipped",
                "reason": "No email or missing items"
            })
            continue

        # ── Generate email HTML (XSS prevention: HTML escape applied) ──
        safe_name = escape(str(member_name))
        items_html = ''.join(
            [f'<li style="margin:8px 0;font-size:15px"><strong>{escape(str(item))}</strong> Did you forget to bring this?</li>' for item in missing_items]
        )
        html = f"""
        <div style="font-family:'Apple SD Gothic Neo',sans-serif;max-width:480px;margin:auto;padding:24px">
          <h2 style="color:#034EA2;margin-bottom:8px">&#x1F514; SmartScan Hub Alert</h2>
          <p style="font-size:16px;margin-bottom:20px"><strong>{safe_name}</strong>, did you forget to bring the following items when heading out?</p>
          <ul style="background:#f0f6ff;padding:16px 24px;border-radius:8px;list-style:none">
            {items_html}
          </ul>
          <p style="color:#718096;font-size:12px;margin-top:20px">This email was automatically sent by SmartScan Hub.</p>
        </div>
        """

        # ── Email delivery ──
        subject = f"[SmartScan Hub] {safe_name}, you forgot some items!"
        ok = send_email([member_email], subject, html)

        status = "sent" if ok else "email_failed"
        print(f"[{status}] {member_name} ({member_email}) → {missing_items}")

        # ── Record in notifications table (isolated from email delivery result) ──
        title = "You forgot some items!"
        message = f"Please check the following items: {', '.join(missing_items)}"
        notification_payload = _build_notification_payload(member, title, message)

        try:
            if notification_payload is not None:
                supabase.table('notifications').insert(notification_payload).execute()
            else:
                print(
                    "Skipping alert DB storage: missing required notifications column values "
                    f"(member_id={member_id})"
                )
        except Exception as db_err:
            print(f"Alert DB storage error (member_id={member_id}): {db_err}")

        results.append({
            "member_id": member_id,
            "status": status,
        })

    sent_count = sum(1 for r in results if r["status"] == "sent")
    return {
        "status": "ok",
        "total": len(results),
        "sent": sent_count,
        "details": results,
    }


def _build_notification_payload(member: dict, title: str, message: str) -> dict | None:
    """Build notification payload for database storage

    Creates a structured notification record for the notifications table.
    Validates required fields and sets default channel preferences.

    Args:
        member: Member data containing IDs and notification preferences
        title: Notification title
        message: Notification message content

    Returns:
        dict or None: Notification payload ready for database insertion,
                      or None if required fields are missing
    """
    family_id = member.get('family_id')
    sender_user_id = member.get('sender_user_id')
    recipient_user_id = member.get('recipient_user_id')

    if family_id is None or sender_user_id is None or recipient_user_id is None:
        return None

    channel = str(member.get('channel') or 'kakao').strip().lower()
    if channel not in {'kakao', 'sms'}:
        channel = 'kakao'

    return {
        "family_id": int(family_id),
        "sender_user_id": int(sender_user_id),
        "recipient_user_id": int(recipient_user_id),
        "type": "missing_alert",
        "channel": channel,
        "title": title,
        "message": message,
        "is_read": False,
    }
