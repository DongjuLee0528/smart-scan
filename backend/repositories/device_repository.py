from typing import Optional

from sqlalchemy.orm import Session

from backend.models.device import Device


class DeviceRepository:
    def __init__(self, db: Session):
        self.db = db

    def find_by_serial_number(self, serial_number: str) -> Optional[Device]:
        return self.db.query(Device).filter(Device.serial_number == serial_number).first()

    def find_by_id(self, device_id: int) -> Optional[Device]:
        return self.db.query(Device).filter(Device.id == device_id).first()

    def find_by_id_and_family_id(self, device_id: int, family_id: int) -> Optional[Device]:
        return self.db.query(Device).filter(
            Device.id == device_id,
            Device.family_id == family_id
        ).first()

    def find_by_family_id(self, family_id: int) -> Optional[Device]:
        return self.db.query(Device).filter(Device.family_id == family_id).first()

    def assign_family(self, device: Device, family_id: int) -> Device:
        device.family_id = family_id
        self.db.flush()
        return device

    def clear_family(self, device: Device) -> Device:
        device.family_id = None
        self.db.flush()
        return device

    def create(self, serial_number: str) -> Device:
        device = Device(serial_number=serial_number)
        self.db.add(device)
        self.db.flush()
        return device
