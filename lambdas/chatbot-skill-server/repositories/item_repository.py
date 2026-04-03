from common.db import get_client


def get_active_items(user_device_id: int):
    # TODO: items + master_tags JOIN, is_active=True
    pass


def add_item(name: str, user_device_id: int, tag_uid: str):
    # TODO: items INSERT
    pass


def deactivate_item(name: str, user_device_id: int) -> int:
    # TODO: items UPDATE is_active=False, 변경 행 수 반환
    pass


def delete_all_items(user_device_id: int):
    # TODO: items DELETE
    pass
