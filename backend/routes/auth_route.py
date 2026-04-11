from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from backend.common.dependencies import get_current_user
from backend.common.db import get_db
from backend.common.response import success_response
from backend.common.route_decorators import handle_service_errors
from backend.common.rate_limiter import limiter, auth_rate_limit, api_rate_limit
from backend.schemas.auth_schema import (
    LoginRequest,
    LogoutRequest,
    RefreshRequest,
    RegisterRequest,
    SendVerificationEmailRequest,
    VerifyEmailRequest,
)
from backend.services.auth_service import AuthService


router = APIRouter(tags=["auth"])


def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    return AuthService(db)


@router.post("/send-verification-email")
@limiter.limit(auth_rate_limit)
@handle_service_errors
async def send_verification_email(
    request: SendVerificationEmailRequest,
    http_request: Request,
    auth_service: AuthService = Depends(get_auth_service)
):
    result = auth_service.send_verification_email(request.email)
    return success_response(
        "Verification email sent successfully",
        result.model_dump()
    )


@router.post("/verify-email")
@limiter.limit(auth_rate_limit)
@handle_service_errors
async def verify_email(
    request: VerifyEmailRequest,
    http_request: Request,
    auth_service: AuthService = Depends(get_auth_service)
):
    result = auth_service.verify_email(request.email, request.code)
    return success_response(
        "Email verified successfully",
        result.model_dump()
    )


@router.post("/register")
@limiter.limit(auth_rate_limit)
@handle_service_errors
async def register(
    request: RegisterRequest,
    http_request: Request,
    auth_service: AuthService = Depends(get_auth_service)
):
    result = auth_service.register(
        kakao_user_id=request.kakao_user_id,
        name=request.name,
        email=request.email,
        password=request.password,
        phone=request.phone,
        age=request.age,
        family_name=request.family_name
    )
    return success_response(
        "Registration completed successfully",
        result.model_dump()
    )


@router.post("/login")
@limiter.limit(auth_rate_limit)
@handle_service_errors
async def login(
    request: LoginRequest,
    http_request: Request,
    auth_service: AuthService = Depends(get_auth_service)
):
    result = auth_service.login(request.email, request.password)
    return success_response(
        "Login completed successfully",
        result.model_dump()
    )


@router.post("/refresh")
@limiter.limit(auth_rate_limit)
@handle_service_errors
async def refresh(
    request: RefreshRequest,
    http_request: Request,
    auth_service: AuthService = Depends(get_auth_service)
):
    result = auth_service.refresh(request.refresh_token)
    return success_response(
        "Token refreshed successfully",
        result.model_dump()
    )


@router.post("/logout")
@handle_service_errors
async def logout(
    request: LogoutRequest,
    current_user=Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service)
):
    result = auth_service.logout(current_user.id, request.refresh_token)
    return success_response(
        "Logout completed successfully",
        result.model_dump()
    )