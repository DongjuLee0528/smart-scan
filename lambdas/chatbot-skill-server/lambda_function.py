import json
import traceback

from common.response import make_res
from services.device_service import register_device
from services.chatbot_service import handle_chatbot


def lambda_handler(event, context):
    request_context = event.get('requestContext', {})
    http_info = request_context.get('http', {})
    method = event.get('httpMethod') or http_info.get('method')
    is_web = 'httpMethod' in event or 'http' in request_context

    try:
        if method == 'OPTIONS':
            return make_res(True, "CORS OK")

        raw_body = event.get('body', '{}')
        body = json.loads(raw_body) if isinstance(raw_body, str) else raw_body

        if is_web and 'user_id' in body and 'serial_number' in body:
            return register_device(body)
        else:
            return handle_chatbot(body)

    except Exception:
        print(traceback.format_exc())
        return make_res(False, "서버 오류가 발생했습니다.", not is_web)
