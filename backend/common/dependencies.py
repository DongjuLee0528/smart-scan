from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from backend.common.db import get_db
from backend.common.exceptions import UnauthorizedException
from backend.common.security import decode_token
from backend.repositories.user_repository import UserRepository


bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db)
):
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise UnauthorizedException("Authorization header is required")

    payload = decode_token(credentials.credentials, expected_type="access")
    user_id = payload.get("sub")
    if not user_id:
        raise UnauthorizedException("Invalid access token payload")

    user = UserRepository(db).find_by_id(int(user_id))
    if not user:
        raise UnauthorizedException("User not found")

    return user
