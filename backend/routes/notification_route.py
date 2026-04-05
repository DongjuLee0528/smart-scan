from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from backend.common.db import get_db
from backend.common.response import success_response
from backend.schemas.notification_schema import ReadNotificationRequest, SendNotificationRequest
from backend.services.notification_service import NotificationService


router = APIRouter(tags=["notifications"])


def get_notification_service(db: Session = Depends(get_db)) -> NotificationService:
    return NotificationService(db)


@router.post("/send/{user_id}", response_model=dict)
def send_notification(
    user_id: int,
    request: SendNotificationRequest,
    notification_service: NotificationService = Depends(get_notification_service)
):
    result = notification_service.send_manual_notification(
        kakao_user_id=request.kakao_user_id,
        recipient_user_id=user_id,
        channel=request.channel,
        title=request.title,
        message=request.message
    )
    return success_response("Notification sent successfully", result.model_dump())


@router.get("", response_model=dict)
def get_my_notifications(
    kakao_user_id: str = Query(..., description="카카오 사용자 ID"),
    notification_service: NotificationService = Depends(get_notification_service)
):
    result = notification_service.get_my_notifications(kakao_user_id)
    return success_response("Notifications retrieved successfully", result.model_dump())


@router.patch("/{notification_id}/read", response_model=dict)
def mark_notification_as_read(
    notification_id: int,
    request: ReadNotificationRequest,
    notification_service: NotificationService = Depends(get_notification_service)
):
    result = notification_service.mark_as_read(
        kakao_user_id=request.kakao_user_id,
        notification_id=notification_id
    )
    return success_response("Notification marked as read successfully", result.model_dump())
