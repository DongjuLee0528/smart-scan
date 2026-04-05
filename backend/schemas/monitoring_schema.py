from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel


class TagCurrentStatus(str, Enum):
    REGISTERED = "REGISTERED"
    FOUND = "FOUND"
    LOST = "LOST"


class MemberSummaryResponse(BaseModel):
    member_id: int
    user_id: int
    name: Optional[str] = None
    email: Optional[str] = None
    role: str
    tag_count: int
    found_count: int
    lost_count: int
    registered_count: int


class TagStatusResponse(BaseModel):
    tag_id: int
    tag_uid: str
    name: str
    owner_user_id: int
    owner_member_id: Optional[int] = None
    owner_name: Optional[str] = None
    status: TagCurrentStatus
    is_active: bool
    item_id: Optional[int] = None
    item_name: Optional[str] = None
    device_id: Optional[int] = None
    last_seen_at: Optional[datetime] = None
    last_scanned_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime


class DashboardSummaryResponse(BaseModel):
    total_members: int
    total_tags: int
    found_count: int
    lost_count: int
    registered_count: int


class MonitoringDashboardResponse(BaseModel):
    family_id: int
    family_name: str
    requester_member_id: int
    requester_role: str
    summary: DashboardSummaryResponse
    members: list[MemberSummaryResponse]


class MemberTagStatusListResponse(BaseModel):
    family_id: int
    family_name: str
    member_id: int
    user_id: int
    member_name: Optional[str] = None
    role: str
    tags: list[TagStatusResponse]
    total_count: int


class MyTagStatusListResponse(BaseModel):
    family_id: int
    family_name: str
    member_id: int
    tags: list[TagStatusResponse]
    total_count: int
