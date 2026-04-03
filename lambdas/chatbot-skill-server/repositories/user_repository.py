from common.db import get_client


def get_user_by_kakao_id(kakao_user_id: str):
    # TODO: users 테이블에서 kakao_user_id로 조회
    pass


def get_user_device(user_id: int):
    # TODO: user_devices + devices JOIN 조회
    pass


def create_user_device(user_id: int, device_id: int):
    # TODO: user_devices INSERT
    pass


def delete_user_device(user_id: int):
    # TODO: user_devices DELETE
    pass
