import json

ALLOWED_ORIGIN = "https://smartscan-hub.com"
CARD_IMG_URL = "https://cdn-icons-png.flaticon.com/512/553/553376.png"

_HEADERS = {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Headers": "Content-Type, X-Requested-With",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
}


def make_res(success: bool, message: str, is_kakao: bool = False, buttons=None) -> dict:
    if not is_kakao:
        return {
            "statusCode": 200,
            "headers": _HEADERS,
            "body": json.dumps({"success": success, "message": str(message)}, ensure_ascii=False),
        }
    output = (
        {"basicCard": {"title": "SmartScan Hub", "description": str(message),
                       "thumbnail": {"imageUrl": CARD_IMG_URL}, "buttons": buttons}}
        if buttons else {"simpleText": {"text": str(message)}}
    )
    return {
        "statusCode": 200,
        "headers": _HEADERS,
        "body": json.dumps({"version": "2.0", "template": {"outputs": [output]}}, ensure_ascii=False),
    }
