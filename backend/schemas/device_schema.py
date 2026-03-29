from pydantic import BaseModel, validator
from datetime import datetime
from typing import Optional


class DeviceRegisterRequest(BaseModel):
    kakao_user_id: str
    serial_number: str

    @validator('kakao_user_id')
    def validate_kakao_user_id(cls, v):
        if not v or not v.strip():
            raise ValueError('kakao_user_id is required')
        return v.strip()

    @validator('serial_number')
    def validate_serial_number(cls, v):
        if not v or not v.strip():
            raise ValueError('serial_number is required')
        return v.strip()


class DeviceResponse(BaseModel):
    id: int
    serial_number: str
    created_at: datetime

    class Config:
        orm_mode = True


class UserDeviceResponse(BaseModel):
    id: int
    user_id: int
    device_id: int
    created_at: datetime
    device: DeviceResponse

    class Config:
        orm_mode = True


class DeviceUnlinkRequest(BaseModel):
    kakao_user_id: str

    @validator('kakao_user_id')
    def validate_kakao_user_id(cls, v):
        if not v or not v.strip():
            raise ValueError('kakao_user_id is required')
        return v.strip()