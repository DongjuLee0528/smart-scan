import os
from common.email_client import send_email


def send_missing_alert(event) -> str:
    detail = event.get('detail', {})
    missing_items = detail.get('missing_items', [])

    if not missing_items:
        return "No missing items."

    recipients = [r.strip() for r in os.environ.get('NOTIFY_EMAILS', '').split(',') if r.strip()]
    if not recipients:
        print("수신자 이메일 미설정 (NOTIFY_EMAILS)")
        return "No recipients configured."

    items_html = ''.join([f'<li style="margin:6px 0">{item}</li>' for item in missing_items])
    html = f"""
    <div style="font-family:sans-serif;max-width:480px;margin:auto">
      <h2 style="color:#e53e3e">🚨 SmartScan Hub 알림</h2>
      <p>외출 시 다음 물건을 확인하세요:</p>
      <ul style="background:#fff5f5;padding:16px 24px;border-radius:8px">
        {items_html}
      </ul>
      <p style="color:#718096;font-size:13px">SmartScan Hub 자동 발송</p>
    </div>
    """

    success = send_email(recipients, "⚠️ 누락 물건 알림 - SmartScan Hub", html)
    if success:
        print(f"이메일 발송 성공: {recipients}")
        return "Success"
    else:
        print("이메일 발송 실패")
        return "Fail"
