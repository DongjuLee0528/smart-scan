"""
FCM token database model

Database model for managing Firebase Cloud Messaging (FCM) tokens for push notifications.
Stores device-specific tokens to enable targeted push notification delivery to user devices.

Business model:
- Token Management: Store and update FCM tokens for each user device
- Device Support: Support multiple devices per user with different tokens
- Notification Targeting: Enable precise notification delivery to specific devices
- Token Lifecycle: Handle token registration, updates, and cleanup

Security considerations:
- Tokens are device-specific and change periodically
- Inactive tokens are tracked to prevent failed notification attempts
- Cascade deletion ensures cleanup when users are deleted
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from backend.common.db import Base


class UserFcmToken(Base):
    """
    FCM token model

    Stores Firebase Cloud Messaging tokens for push notification delivery
    to user devices in the Smart Scan system.
    """
    __tablename__ = 'user_fcm_tokens'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    token = Column(Text, nullable=False)
    device_type = Column(String(20), nullable=False, default='android')
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="fcm_tokens")

    __table_args__ = (
        UniqueConstraint('user_id', 'token', name='uq_user_fcm_token'),
    )