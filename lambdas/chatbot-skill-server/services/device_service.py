from common.response import make_res
from repositories.tag_repository import get_device_by_serial
from repositories.user_repository import get_user_by_kakao_id, create_user_device


def register_device(body: dict) -> dict:
    # TODO: serial_number 형식 검증, 기기 조회, user_device 생성
    pass
