import base64
import hashlib
import hmac
import json
import secrets
from datetime import datetime, timedelta, timezone
from uuid import uuid4

from backend.common.config import settings
from backend.common.exceptions import UnauthorizedException


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        settings.PASSWORD_HASH_ITERATIONS
    )
    return (
        f"pbkdf2_sha256${settings.PASSWORD_HASH_ITERATIONS}$"
        f"{salt.hex()}${digest.hex()}"
    )


def verify_password(password: str, password_hash: str | None) -> bool:
    if not password_hash:
        return False

    try:
        algorithm, iterations, salt_hex, digest_hex = password_hash.split("$", 3)
    except ValueError:
        return False

    if algorithm != "pbkdf2_sha256":
        return False

    calculated_digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        bytes.fromhex(salt_hex),
        int(iterations)
    ).hex()
    return hmac.compare_digest(calculated_digest, digest_hex)


def generate_token_id() -> str:
    return uuid4().hex


def create_access_token(user_id: int) -> tuple[str, datetime]:
    issued_at = datetime.now(timezone.utc)
    expires_at = issued_at + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": str(user_id),
        "type": "access",
        "iat": int(issued_at.timestamp()),
        "exp": int(expires_at.timestamp())
    }
    return encode_jwt(payload), expires_at


def create_refresh_token(user_id: int, token_id: str) -> tuple[str, datetime]:
    issued_at = datetime.now(timezone.utc)
    expires_at = issued_at + timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": str(user_id),
        "type": "refresh",
        "jti": token_id,
        "iat": int(issued_at.timestamp()),
        "exp": int(expires_at.timestamp())
    }
    return encode_jwt(payload), expires_at


def decode_token(token: str, expected_type: str | None = None) -> dict:
    try:
        header_segment, payload_segment, signature_segment = token.split(".")
    except ValueError as exc:
        raise UnauthorizedException("Invalid token format") from exc

    signing_input = f"{header_segment}.{payload_segment}".encode("utf-8")
    expected_signature = _sign(signing_input)
    if not hmac.compare_digest(expected_signature, signature_segment):
        raise UnauthorizedException("Invalid token signature")

    payload = _json_loads(_base64url_decode(payload_segment))
    if payload.get("exp") is None:
        raise UnauthorizedException("Invalid token payload")

    if int(payload["exp"]) <= int(datetime.now(timezone.utc).timestamp()):
        raise UnauthorizedException("Token has expired")

    if expected_type and payload.get("type") != expected_type:
        raise UnauthorizedException("Invalid token type")

    return payload


def encode_jwt(payload: dict) -> str:
    header = {"alg": settings.JWT_ALGORITHM, "typ": "JWT"}
    encoded_header = _base64url_encode(_json_dumps(header))
    encoded_payload = _base64url_encode(_json_dumps(payload))
    signature = _sign(f"{encoded_header}.{encoded_payload}".encode("utf-8"))
    return f"{encoded_header}.{encoded_payload}.{signature}"


def _sign(value: bytes) -> str:
    digest = hmac.new(
        settings.JWT_SECRET_KEY.encode("utf-8"),
        value,
        hashlib.sha256
    ).digest()
    return _base64url_encode(digest)


def _json_dumps(value: dict) -> bytes:
    return json.dumps(value, separators=(",", ":"), sort_keys=True).encode("utf-8")


def _json_loads(value: bytes) -> dict:
    return json.loads(value.decode("utf-8"))


def _base64url_encode(value: bytes) -> str:
    return base64.urlsafe_b64encode(value).rstrip(b"=").decode("utf-8")


def _base64url_decode(value: str) -> bytes:
    padding = "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode(f"{value}{padding}")
