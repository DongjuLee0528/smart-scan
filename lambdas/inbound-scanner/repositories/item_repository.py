"""
Item Repository

Repository functions for device and item-related database operations.
Used by scan service for device lookup and missing item detection.
"""

from common.db import get_client


def get_device_by_serial(serial_number: str):
    """Find device by serial number"""
    client = get_client()
    res = (client.table('devices')
           .select('id, family_id')
           .eq('serial_number', serial_number)
           .maybe_single()
           .execute())
    return res.data if res.data else None


def get_items_by_tags(tag_uids: list) -> list:
    """tag_uid 목록으로 아이템 이름과 소유자 정보 조회 (귀가 이메일용)"""
    if not tag_uids:
        return []
    client = get_client()

    item_res = (client.table('items')
                .select('name, tag_uid, user_device_id')
                .in_('tag_uid', list(tag_uids))
                .execute())
    if not item_res.data:
        return []

    ud_ids = list({r['user_device_id'] for r in item_res.data})
    ud_res = (client.table('user_devices')
              .select('id, users(id, name, email)')
              .in_('id', ud_ids)
              .execute())

    ud_map = {ud['id']: ud.get('users', {}) or {} for ud in (ud_res.data or [])}

    return [
        {
            'item_name': item['name'],
            'tag_uid': item['tag_uid'],
            'member_id': ud_map.get(item['user_device_id'], {}).get('id'),
            'member_name': ud_map.get(item['user_device_id'], {}).get('name'),
            'member_email': ud_map.get(item['user_device_id'], {}).get('email'),
        }
        for item in item_res.data
    ]


def check_missing_items_rpc(device_id: int, scanned_tags: list):
    """Check for missing items using RPC function

    Calls database RPC function that compares scanned tags against
    registered items for the device to identify missing belongings.

    Args:
        device_id: ID of the scanning device
        scanned_tags: List of RFID tag UIDs that were scanned

    Returns:
        List of missing item details with member information
    """
    client = get_client()
    res = client.rpc('check_missing_items', {
        'p_device_id': device_id,
        'p_tag_uids': scanned_tags
    }).execute()
    return res.data or []
