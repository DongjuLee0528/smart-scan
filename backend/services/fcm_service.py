import logging
from typing import Dict, Any, Optional

from firebase_admin import messaging
from sqlalchemy.orm import Session

from backend.common.exceptions import CustomException
from backend.common.firebase_config import get_firebase_app
from backend.repositories.user_fcm_token_repository import UserFcmTokenRepository

logger = logging.getLogger(__name__)


class FcmService:
    def __init__(self, db: Optional[Session] = None):
        self.db = db
        if db:
            self.fcm_token_repository = UserFcmTokenRepository(db)
        try:
            get_firebase_app()
        except Exception as e:
            logger.warning("Firebase not initialized: %s", e)

    def send_push_notification(
        self,
        fcm_token: str,
        title: str,
        body: str,
        data: Optional[Dict[str, str]] = None
    ) -> bool:
        try:
            message = messaging.Message(
                notification=messaging.Notification(
                    title=title,
                    body=body
                ),
                data=data or {},
                token=fcm_token,
                android=messaging.AndroidConfig(
                    notification=messaging.AndroidNotification(
                        channel_id="smart-scan-alerts",
                        priority="high"
                    )
                ),
                apns=messaging.APNSConfig(
                    payload=messaging.APNSPayload(
                        aps=messaging.Aps(
                            alert=messaging.ApsAlert(
                                title=title,
                                body=body
                            ),
                            sound="default"
                        )
                    )
                )
            )

            response = messaging.send(message)
            logger.info("Successfully sent FCM message: %s", response)
            return True

        except messaging.UnregisteredError:
            logger.warning("FCM token is invalid or unregistered: %s", fcm_token)
            if self.db and self.fcm_token_repository:
                self.fcm_token_repository.delete_by_token(fcm_token)
                self.db.commit()
            return False
        except Exception as e:
            logger.error("Failed to send FCM notification to token %s: %s", fcm_token, e)
            return False

    def send_push_to_user(
        self,
        user_id: int,
        title: str,
        body: str,
        data: Optional[Dict[str, str]] = None
    ) -> bool:
        if not self.db or not self.fcm_token_repository:
            logger.warning("Database session not available for FCM service")
            return False

        try:
            tokens = self.fcm_token_repository.find_active_tokens_by_user_id(user_id)
            if not tokens:
                logger.info("No FCM tokens found for user_id: %s", user_id)
                return False

            success_count = 0
            for token_record in tokens:
                success = self.send_push_notification(token_record.token, title, body, data)
                if success:
                    success_count += 1

            logger.info("Sent FCM notifications to %d/%d tokens for user_id: %s",
                       success_count, len(tokens), user_id)
            return success_count > 0

        except Exception as e:
            logger.error("Failed to send FCM notification to user_id %s: %s", user_id, e)
            return False

    def register_token(self, user_id: int, token: str, device_type: str) -> Any:
        if not self.db or not self.fcm_token_repository:
            raise CustomException(500, "Database session not available")

        try:
            existing_token = self.fcm_token_repository.find_by_user_id_and_token(user_id, token)
            if existing_token:
                updated_token = self.fcm_token_repository.update_token(existing_token, device_type)
                self.db.commit()
                self.db.refresh(updated_token)
                return updated_token

            new_token = self.fcm_token_repository.create(user_id, token, device_type)
            self.db.commit()
            self.db.refresh(new_token)
            return new_token

        except Exception:
            self.db.rollback()
            raise

    def delete_user_tokens(self, user_id: int) -> bool:
        if not self.db or not self.fcm_token_repository:
            raise CustomException(500, "Database session not available")

        try:
            deleted_count = self.fcm_token_repository.delete_by_user_id(user_id)
            self.db.commit()
            logger.info("Deleted %d FCM tokens for user_id: %s", deleted_count, user_id)
            return deleted_count > 0

        except Exception:
            self.db.rollback()
            raise