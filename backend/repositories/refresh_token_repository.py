from datetime import datetime
from typing import Optional

from sqlalchemy.orm import Session

from backend.models.refresh_token import RefreshToken


class RefreshTokenRepository:
    def __init__(self, db: Session):
        self.db = db

    def find_by_token_id(self, token_id: str) -> Optional[RefreshToken]:
        return self.db.query(RefreshToken).filter(RefreshToken.token_id == token_id).first()

    def revoke_all_active_by_user_id(self, user_id: int, revoked_at: datetime) -> None:
        self.db.query(RefreshToken).filter(
            RefreshToken.user_id == user_id,
            RefreshToken.is_revoked.is_(False)
        ).update(
            {
                RefreshToken.is_revoked: True,
                RefreshToken.revoked_at: revoked_at
            },
            synchronize_session=False
        )

    def create(
        self,
        user_id: int,
        token_id: str,
        created_at: datetime,
        expires_at: datetime
    ) -> RefreshToken:
        refresh_token = RefreshToken(
            user_id=user_id,
            token_id=token_id,
            created_at=created_at,
            expires_at=expires_at,
            is_revoked=False
        )
        self.db.add(refresh_token)
        self.db.flush()
        return refresh_token

    def revoke(self, refresh_token: RefreshToken, revoked_at: datetime) -> RefreshToken:
        refresh_token.is_revoked = True
        refresh_token.revoked_at = revoked_at
        self.db.flush()
        return refresh_token
