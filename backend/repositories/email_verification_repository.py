from datetime import datetime
from sqlalchemy.orm import Session
from backend.models.email_verification import EmailVerification


class EmailVerificationRepository:
    def __init__(self, db: Session):
        self.db = db

    def invalidate_pending_by_email(self, email: str, now: datetime) -> None:
        self.db.query(EmailVerification).filter(
            EmailVerification.email == email,
            EmailVerification.verified_at.is_(None),
            EmailVerification.used_at.is_(None),
            EmailVerification.expires_at > now
        ).update(
            {EmailVerification.expires_at: now},
            synchronize_session=False
        )

    def create(self, email: str, code: str, expires_at: datetime) -> EmailVerification:
        verification = EmailVerification(
            email=email,
            code=code,
            expires_at=expires_at
        )
        self.db.add(verification)
        self.db.flush()
        return verification

    def find_latest_by_email_and_code(self, email: str, code: str) -> EmailVerification | None:
        return self.db.query(EmailVerification).filter(
            EmailVerification.email == email,
            EmailVerification.code == code
        ).order_by(
            EmailVerification.id.desc()
        ).first()

    def find_latest_verified_unused_by_email(
        self,
        email: str,
        now: datetime
    ) -> EmailVerification | None:
        return self.db.query(EmailVerification).filter(
            EmailVerification.email == email,
            EmailVerification.verified_at.is_not(None),
            EmailVerification.used_at.is_(None),
            EmailVerification.expires_at > now
        ).order_by(
            EmailVerification.id.desc()
        ).first()

    def mark_verified(self, verification: EmailVerification, verified_at: datetime) -> EmailVerification:
        verification.verified_at = verified_at
        self.db.flush()
        return verification

    def mark_used(self, verification: EmailVerification, used_at: datetime) -> EmailVerification:
        verification.used_at = used_at
        self.db.flush()
        return verification
