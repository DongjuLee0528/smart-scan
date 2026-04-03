from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from backend.common.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    kakao_user_id = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=True)
    email = Column(String(255), unique=True, nullable=True, index=True)
    phone = Column(String(50), nullable=True)
    age = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # relationships
    owned_families = relationship(
        "Family",
        back_populates="owner",
        foreign_keys="Family.owner_user_id"
    )
    owned_tags = relationship("Tag", back_populates="owner")
    family_members = relationship("FamilyMember", back_populates="user")
    user_devices = relationship("UserDevice", back_populates="user")
