"""
FCM token data access layer

Repository responsible for database operations on Firebase Cloud Messaging tokens.
Manages FCM token registration, updates, and cleanup for push notification delivery.

Data management:
- FCM token registration and updates
- Device-specific token management
- Token validation and cleanup
- Multi-device token support per user
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from backend.models.user_fcm_token import UserFcmToken


class UserFcmTokenRepository:
    """
    FCM token data access layer

    Handles database operations for Firebase Cloud Messaging tokens
    used for push notification delivery to user devices.
    """
    def __init__(self, db: Session):
        self.db = db

    def create(self, user_id: int, token: str, device_type: str) -> UserFcmToken:
        fcm_token = UserFcmToken(
            user_id=user_id,
            token=token,
            device_type=device_type,
            is_active=True
        )
        self.db.add(fcm_token)
        return fcm_token

    def find_by_user_id_and_token(self, user_id: int, token: str) -> Optional[UserFcmToken]:
        return self.db.query(UserFcmToken).filter(
            UserFcmToken.user_id == user_id,
            UserFcmToken.token == token
        ).first()

    def find_active_tokens_by_user_id(self, user_id: int) -> List[UserFcmToken]:
        return self.db.query(UserFcmToken).filter(
            UserFcmToken.user_id == user_id,
            UserFcmToken.is_active == True
        ).all()

    def update_token(self, fcm_token: UserFcmToken, device_type: str) -> UserFcmToken:
        fcm_token.device_type = device_type
        fcm_token.is_active = True
        return fcm_token

    def delete_by_token(self, token: str) -> int:
        deleted_count = self.db.query(UserFcmToken).filter(
            UserFcmToken.token == token
        ).delete()
        return deleted_count

    def delete_by_user_id(self, user_id: int) -> int:
        deleted_count = self.db.query(UserFcmToken).filter(
            UserFcmToken.user_id == user_id
        ).delete()
        return deleted_count