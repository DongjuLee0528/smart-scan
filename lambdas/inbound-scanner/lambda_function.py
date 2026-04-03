from services.scan_service import process_scan


def lambda_handler(event, context):
    return process_scan(event)
