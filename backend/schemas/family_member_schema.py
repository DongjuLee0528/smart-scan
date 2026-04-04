from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, field_validator


def _validate_required_text(value: str, field_name: str) -> str:
    normalized_value = value.strip()
    if not normalized_value:
        raise ValueError(f"{field_name} is required")
    return normalized_value


class AddFamilyMemberRequest(BaseModel):
    name: str
    email: str
    phone_number: str
    age: Optional[int] = None

    @field_validator("name", "email", "phone_number")
    @classmethod
    def validate_required_text(cls, v: str, info) -> str:
        return _validate_required_text(v, info.field_name)


class FamilyMemberResponse(BaseModel):
    id: int
    family_id: int
    user_id: int
    role: str
    name: Optional[str] = None
    email: Optional[str] = None
    phone_number: Optional[str] = None
    age: Optional[int] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class FamilyMemberListResponse(BaseModel):
    family_id: int
    family_name: str
    members: list[FamilyMemberResponse]
    total_count: int
