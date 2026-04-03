import json
import boto3

from repositories.item_repository import get_user_device_id, get_active_items

events = boto3.client('events')


def process_scan(event):
    body = json.loads(event.get('body', '{}'))
    kakao_user_id = body.get('user_id')
    serial_number = body.get('device_serial')
    scanned_tags = body.get('tags', [])

    user_device_id = get_user_device_id(kakao_user_id, serial_number)
    if not user_device_id:
        return {
            "statusCode": 400,
            "body": json.dumps({"message": "기기 연결 정보를 찾을 수 없습니다."})
        }

    items = get_active_items(user_device_id)
    missing = [item['name'] for item in items if item['tag_uid'] not in scanned_tags]

    if missing:
        print(f"누락 발생: {missing}")
        events.put_events(Entries=[{
            'Source': 'smartscan.inbound',
            'DetailType': 'MissingItemDetected',
            'Detail': json.dumps({'user_id': kakao_user_id, 'missing_items': missing}),
            'EventBusName': 'default'
        }])
        return {"statusCode": 200, "body": json.dumps({"message": f"누락 물건: {missing}"})}

    return {"statusCode": 200, "body": json.dumps({"message": "모든 물건이 확인되었습니다."})}
