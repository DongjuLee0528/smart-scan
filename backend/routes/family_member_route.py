from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from backend.common.db import get_db
from backend.common.response import success_response
from backend.schemas.family_member_schema import AddFamilyMemberRequest
from backend.services.family_member_service import FamilyMemberService


router = APIRouter(tags=["family-members"])


def get_family_member_service(db: Session = Depends(get_db)) -> FamilyMemberService:
    return FamilyMemberService(db)


@router.post("", response_model=dict)
def add_family_member(
    request: AddFamilyMemberRequest,
    kakao_user_id: str = Query(..., description="카카오 사용자 ID"),
    family_member_service: FamilyMemberService = Depends(get_family_member_service)
):
    result = family_member_service.add_member(
        kakao_user_id=kakao_user_id,
        name=request.name,
        email=request.email,
        phone_number=request.phone_number,
        age=request.age
    )
    return success_response("Family member added successfully", result.model_dump())


@router.get("", response_model=dict)
def get_family_members(
    kakao_user_id: str = Query(..., description="카카오 사용자 ID"),
    family_member_service: FamilyMemberService = Depends(get_family_member_service)
):
    result = family_member_service.get_members(kakao_user_id)
    return success_response("Family members retrieved successfully", result.model_dump())


@router.delete("/{member_id}", response_model=dict)
def delete_family_member(
    member_id: int,
    kakao_user_id: str = Query(..., description="카카오 사용자 ID"),
    family_member_service: FamilyMemberService = Depends(get_family_member_service)
):
    result = family_member_service.delete_member(kakao_user_id, member_id)
    return success_response("Family member deleted successfully", {"deleted": result})
