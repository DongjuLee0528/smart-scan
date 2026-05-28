"""
Family member database model

Database model representing membership relationships between users and families in SmartScan system.
Manages user roles within families and access permissions to family resources.

Business model:
- Member Registration: Users join families through invitations
- Role Management: Each member has a specific role (owner, member, etc.)
- Access Control: Determines which family resources users can access

Relationship connections:
- N:1 relationships: family, user
- Unique constraint: prevents duplicate memberships for same user in same family
"""

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from backend.common.db import Base


class FamilyMember(Base):
    """
    Family member model

    Represents the many-to-many relationship between users and families,
    including role-based access control within family groups.
    """
    __tablename__ = "family_members"
    __table_args__ = (
        UniqueConstraint("family_id", "user_id", name="uq_family_members_family_user"),
    )

    id = Column(Integer, primary_key=True, index=True)
    family_id = Column(Integer, ForeignKey("families.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    role = Column(String(50), nullable=False, default="member")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # relationships
    family = relationship("Family", back_populates="family_members")
    user = relationship("User", back_populates="family_members")
