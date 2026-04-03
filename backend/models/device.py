from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from backend.common.db import Base


class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    serial_number = Column(String(255), unique=True, nullable=False, index=True)
    family_id = Column(Integer, ForeignKey("families.id"), nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # relationships
    family = relationship("Family", back_populates="devices")
    tags = relationship("Tag", back_populates="device")
    user_devices = relationship("UserDevice", back_populates="device")
    master_tags = relationship("MasterTag", back_populates="device")
