from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.common.db import Base


class ScanLog(Base):
    __tablename__ = "scan_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_device_id = Column(Integer, ForeignKey("user_devices.id"), nullable=False)
    item_id = Column(Integer, ForeignKey("items.id"), nullable=True)
    status = Column(String(50), nullable=False)
    scanned_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # relationships
    user_device = relationship("UserDevice", back_populates="scan_logs")
    item = relationship("Item", back_populates="scan_logs")