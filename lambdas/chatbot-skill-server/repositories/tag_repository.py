from common.db import get_client


def get_tag_by_label(device_id: int, label_id: str):
    # TODO: master_tags에서 device_id + label_id로 tag_uid 조회
    pass


def get_available_labels(device_id: int, used_tag_uids: list):
    # TODO: master_tags에서 사용되지 않은 label_id 목록 반환
    pass


def get_device_by_serial(serial_number: str):
    # TODO: devices 테이블에서 serial_number로 조회
    pass
