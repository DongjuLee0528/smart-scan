from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, field_validator


class NotificationType(str, Enum):
    MISSING_ALERT = "missing_alert"
    MANUAL_ALERT = "manual_alert"


class NotificationChannel(str, Enum):
    KAKAO = "kakao"
    SMS = "sms"


def _validate_required_text(value: str, field_name: str) -> str:
    normalized_value = value.strip()
    if not normalized_value:
        raise ValueError(f"{field_name} is required")
    return normalized_value


class SendNotificationRequest(BaseModel):
    kakao_user_id: str
    channel: NotificationChannel
    title: str
    message: str

    @field_validator("kakao_user_id", "title", "message")
    @classmethod
    def validate_required_text(cls, v: str, info) -> str:
        return _validate_required_text(v, info.field_name)


class ReadNotificationRequest(BaseModel):
    kakao_user_id: str

    @field_validator("kakao_user_id")
    @classmethod
    def validate_required_text(cls, v: str, info) -> str:
        return _validate_required_text(v, info.field_name)


class NotificationResponse(BaseModel):
    id: int
    family_id: int
    sender_user_id: int
    recipient_user_id: int
    type: NotificationType
    channel: NotificationChannel
    title: str
    message: str
    is_read: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class NotificationListResponse(BaseModel):
    notifications: list[NotificationResponse]
    total_count: int
