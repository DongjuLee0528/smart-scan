from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.common.db import get_db
from backend.common.response import success_response
from backend.schemas.auth_schema import (
    RegisterRequest,
    SendVerificationEmailRequest,
    VerifyEmailRequest,
)
from backend.services.auth_service import AuthService


router = APIRouter(tags=["auth"])


def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    return AuthService(db)


@router.post("/send-verification-email")
async def send_verification_email(
    request: SendVerificationEmailRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    result = auth_service.send_verification_email(request.email)
    return success_response(
        "Verification email sent successfully",
        result.model_dump()
    )


@router.post("/verify-email")
async def verify_email(
    request: VerifyEmailRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    result = auth_service.verify_email(request.email, request.code)
    return success_response(
        "Email verified successfully",
        result.model_dump()
    )


@router.post("/register")
async def register(
    request: RegisterRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    result = auth_service.register(
        kakao_user_id=request.kakao_user_id,
        name=request.name,
        email=request.email,
        phone=request.phone,
        age=request.age,
        family_name=request.family_name
    )
    return success_response(
        "Registration completed successfully",
        result.model_dump()
    )
