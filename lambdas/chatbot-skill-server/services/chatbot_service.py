from common.response import make_res, ALLOWED_ORIGIN
from repositories.user_repository import get_user_by_kakao_id, get_user_device, delete_user_device
from repositories.item_repository import get_active_items, add_item, deactivate_item, delete_all_items
from repositories.tag_repository import get_tag_by_label, get_available_labels


def handle_chatbot(body: dict) -> dict:
    # TODO: utterance 파싱 후 목록/추가/삭제/해제 분기
    pass


def _handle_list(user_device_id: int, serial_number: str, device_id: int) -> dict:
    # TODO: 등록된 물건 목록 + 사용 가능 번호 반환
    pass


def _handle_add(utterance: str, user_device_id: int, device_id: int) -> dict:
    # TODO: "물건명 추가 N" 파싱 후 items INSERT
    pass


def _handle_delete(utterance: str, user_device_id: int) -> dict:
    # TODO: "물건명 삭제" 파싱 후 is_active=False
    pass


def _handle_disconnect(user_id: int, user_device_id: int) -> dict:
    # TODO: items + user_devices 전체 삭제
    pass
