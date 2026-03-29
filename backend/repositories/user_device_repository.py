from sqlalchemy.orm import Session, joinedload
from backend.models.user_device import UserDevice
from typing import Optional


class UserDeviceRepository:
    def __init__(self, db: Session):
        self.db = db

    def find_by_user_and_device(self, user_id: int, device_id: int) -> Optional[UserDevice]:
        return self.db.query(UserDevice).filter(
            UserDevice.user_id == user_id,
            UserDevice.device_id == device_id
        ).first()

    def find_by_user_id(self, user_id: int) -> Optional[UserDevice]:
        return self.db.query(UserDevice).options(
            joinedload(UserDevice.device)
        ).filter(UserDevice.user_id == user_id).first()

    def create(self, user_id: int, device_id: int) -> UserDevice:
        user_device = UserDevice(user_id=user_id, device_id=device_id)
        self.db.add(user_device)
        self.db.commit()
        self.db.refresh(user_device)
        return user_device

    def delete_by_user_id(self, user_id: int) -> bool:
        user_device = self.db.query(UserDevice).filter(UserDevice.user_id == user_id).first()
        if user_device:
            self.db.delete(user_device)
            self.db.commit()
            return True
        return False