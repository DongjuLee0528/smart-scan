"""
RFID Scan Data Processing Service

Business logic for processing scan data sent from Raspberry Pi RFID readers.
Scans UHF RFID tags when passing through doorway to detect missing belongings.

Main Features:
- RFID scan data validation and parsing
- User identification by device serial number
- Missing belongings detection (using RPC functions)
- Automatic outbound-notifier Lambda invocation
- Scan log storage in Supabase

Version: 2024-03-15 - RPC-based performance optimized version
"""

import json
import logging
import time
import boto3
from datetime import datetime, timezone

from common.db import get_client
from repositories.item_repository import (
    get_device_by_serial,
    check_missing_items_rpc,
    get_items_by_tags
)

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

lambda_client = boto3.client('lambda', region_name='ap-northeast-2')

_last_notified: dict[int, float] = {}  # member_id → last notified timestamp
_last_outbound_tags: dict[int, set] = {}  # device_id → 외출 시 스캔된 tag_uid 집합
NOTIFY_COOLDOWN_SEC = 20  # 20 seconds per member (시연용)


def _is_return_home(device_id: int, scanned_tags: list) -> bool:
    """이전 외출 기록과 현재 스캔 태그가 겹치면 귀가 판정"""
    last_tags = _last_outbound_tags.get(device_id, set())
    return bool(last_tags and set(scanned_tags) & last_tags)


def process_scan(event):
    try:
        raw_body = event.get('body', '{}')
        body = json.loads(raw_body) if isinstance(raw_body, str) else raw_body
    except (json.JSONDecodeError, TypeError) as e:
        logger.warning("Request body parsing failed: %s", str(e))
        return {
            "statusCode": 400,
            "body": json.dumps({"message": "Invalid request format"})
        }

    serial_number = body.get('device_serial')
    scanned_tags = body.get('tags', [])

    if not serial_number or not isinstance(serial_number, str):
        return {
            "statusCode": 400,
            "body": json.dumps({"message": "device_serial value is required"})
        }

    if not isinstance(scanned_tags, list):
        return {
            "statusCode": 400,
            "body": json.dumps({"message": "tags must be an array."})
        }

    # Device lookup
    device = get_device_by_serial(serial_number)
    if not device:
        return {
            "statusCode": 400,
            "body": json.dumps({"message": "Unregistered device"})
        }

    device_id = device['id']

    # ── 귀가 vs 외출 방향 판정 ──
    if _is_return_home(device_id, scanned_tags):
        return _handle_return_home(device_id, scanned_tags)
    else:
        return _handle_outbound(device_id, scanned_tags)


def _handle_return_home(device_id: int, scanned_tags: list) -> dict:
    """귀가 처리: RETURNED 로그 삽입 + 밖에 두고 온 물건 알림"""
    outbound_tags = _last_outbound_tags.pop(device_id)
    left_outside_tags = outbound_tags - set(scanned_tags)

    _insert_scan_logs(device_id, scanned_tags, status='RETURNED')

    logger.info(
        "Return home detected — device_id: %s, returned: %d tags, left outside: %d tags",
        device_id, len(scanned_tags), len(left_outside_tags)
    )

    if left_outside_tags:
        items = get_items_by_tags(list(left_outside_tags))
        grouped = _group_left_items_by_member(items)
        if grouped:
            try:
                lambda_client.invoke(
                    FunctionName='smartscan-outbound',
                    InvocationType='Event',
                    Payload=json.dumps({
                        'alert_type': 'return_home',
                        'device_id': device_id,
                        'left_items_by_member': grouped
                    })
                )
            except Exception as e:
                logger.error("Outbound Lambda invocation failed (귀가) — device_id: %s, error: %s", device_id, str(e))

    return {
        "statusCode": 200,
        "body": json.dumps({"message": "Return home processed."})
    }


def _handle_outbound(device_id: int, scanned_tags: list) -> dict:
    """외출 처리: 태그 기록 + FOUND 로그 삽입 + 미소지 알림"""
    _last_outbound_tags[device_id] = set(scanned_tags)

    _insert_scan_logs(device_id, scanned_tags, status='FOUND')

    missing = check_missing_items_rpc(device_id, scanned_tags)

    if missing:
        grouped = _group_by_member(missing)
        missing_names = [item['missing_item'] for item in missing]
        logger.info(
            "Missing items detected — device_id: %s, missing count: %d, member count: %d",
            device_id, len(missing_names), len(grouped)
        )

        now = time.time()
        to_notify = [
            m for m in grouped
            if now - _last_notified.get(m['member_id'], 0) >= NOTIFY_COOLDOWN_SEC
        ]
        for m in grouped:
            if m not in to_notify:
                remaining = int(NOTIFY_COOLDOWN_SEC - (now - _last_notified[m['member_id']]))
                logger.info("Notification cooldown active — member_id: %s, remaining: %ds", m['member_id'], remaining)

        if to_notify:
            for m in to_notify:
                _last_notified[m['member_id']] = now
            try:
                lambda_client.invoke(
                    FunctionName='smartscan-outbound',
                    InvocationType='Event',
                    Payload=json.dumps({
                        'device_id': device_id,
                        'missing_by_member': to_notify
                    })
                )
            except Exception as e:
                logger.error("Outbound Lambda invocation failed — device_id: %s, error: %s", device_id, str(e))

        return {
            "statusCode": 200,
            "body": json.dumps({"message": f"Missing items: {missing_names}"})
        }

    return {
        "statusCode": 200,
        "body": json.dumps({"message": "All items confirmed."})
    }


def _insert_scan_logs(device_id: int, scanned_tags: list, status: str = 'FOUND'):
    """Record logs for each scanned tag (actual scan_logs schema: user_device_id, item_id, status)"""
    if not scanned_tags:
        return

    try:
        client = get_client()
        now = datetime.now(timezone.utc).isoformat()

        item_res = client.table('items').select('id,tag_uid,user_device_id').in_('tag_uid', scanned_tags).execute()
        if not item_res.data:
            logger.warning("items not found for scanned tags — device_id: %s", device_id)
            return

        rows = []
        for item in item_res.data:
            rows.append({
                'user_device_id': item['user_device_id'],
                'item_id': item['id'],
                'status': status,
                'scanned_at': now
            })

        if rows:
            client.table('scan_logs').insert(rows).execute()
    except Exception as e:
        logger.error("scan_logs insert failed — device_id: %s, error: %s", device_id, str(e))


def _group_left_items_by_member(items: list) -> list:
    """밖에 두고 온 아이템을 멤버별로 그룹핑 (귀가 알림용)"""
    members = {}
    for item in items:
        mid = item.get('member_id')
        if mid is None:
            continue
        if mid not in members:
            members[mid] = {
                'member_id': mid,
                'member_name': item.get('member_name', ''),
                'member_email': item.get('member_email', ''),
                'left_items': []
            }
        members[mid]['left_items'].append(item['item_name'])
    return [m for m in members.values() if m.get('member_email') and m['left_items']]


def _group_by_member(missing_items: list) -> list:
    """Group missing items by member"""
    members = {}
    for item in missing_items:
        mid = item['member_id']
        if mid not in members:
            members[mid] = {
                'member_id': mid,
                'member_name': item['member_name'],
                'member_email': item['member_email'],
                'missing_items': []
            }
            if item.get('family_id') is not None:
                members[mid]['family_id'] = item['family_id']
            if item.get('sender_user_id') is not None:
                members[mid]['sender_user_id'] = item['sender_user_id']
            if item.get('recipient_user_id') is not None:
                members[mid]['recipient_user_id'] = item['recipient_user_id']
            if item.get('channel') is not None:
                members[mid]['channel'] = item['channel']
        members[mid]['missing_items'].append(item['missing_item'])
    return list(members.values())
