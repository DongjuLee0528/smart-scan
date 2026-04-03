import smtplib
from datetime import datetime
from email.message import EmailMessage
from backend.common.config import settings
from backend.common.exceptions import CustomException


class EmailService:
    def __init__(self) -> None:
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_username = settings.SMTP_USERNAME
        self.smtp_password = settings.SMTP_PASSWORD
        self.smtp_use_tls = settings.SMTP_USE_TLS
        self.smtp_use_ssl = settings.SMTP_USE_SSL or self.smtp_port == 465
        self.from_email = settings.SMTP_FROM_EMAIL or settings.SMTP_USERNAME
        self.from_name = settings.SMTP_FROM_NAME

    def send_verification_code(self, to_email: str, code: str, expires_at: datetime) -> None:
        if not all([self.smtp_host, self.smtp_username, self.smtp_password, self.from_email]):
            raise CustomException(500, "SMTP settings are not configured")

        message = EmailMessage()
        message["Subject"] = "[Smart Scan] Email Verification Code"
        message["From"] = f"{self.from_name} <{self.from_email}>"
        message["To"] = to_email
        message.set_content(
            "\n".join(
                [
                    "Smart Scan email verification",
                    "",
                    f"Verification code: {code}",
                    f"Expires at: {expires_at.isoformat()}",
                ]
            )
        )

        if self.smtp_use_ssl:
            with smtplib.SMTP_SSL(self.smtp_host, self.smtp_port) as server:
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(message)
            return

        with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
            if self.smtp_use_tls:
                server.starttls()
            server.login(self.smtp_username, self.smtp_password)
            server.send_message(message)
