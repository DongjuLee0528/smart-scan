from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from backend.common.db import Base


class UserFcmToken(Base):
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