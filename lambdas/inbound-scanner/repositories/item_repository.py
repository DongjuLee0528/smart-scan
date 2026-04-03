from common.db import get_client


def get_user_device_id(kakao_user_id: str, serial_number: str):
    client = get_client()

    user = client.table('users').select('id').eq('kakao_user_id', kakao_user_id).single().execute()
    if not user.data:
        return None

    device = client.table('devices').select('id').eq('serial_number', serial_number).single().execute()
    if not device.data:
        return None

    ud = (client.table('user_devices')
          .select('id')
          .eq('user_id', user.data['id'])
          .eq('device_id', device.data['id'])
          .single()
          .execute())
    return ud.data['id'] if ud.data else None


def get_active_items(user_device_id: int):
    client = get_client()
    res = (client.table('items')
           .select('id, name, tag_uid')
           .eq('user_device_id', user_device_id)
           .eq('is_active', True)
           .execute())
    return res.data or []
