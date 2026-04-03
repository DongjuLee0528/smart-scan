from services.notify_service import send_missing_alert


def lambda_handler(event, context):
    return send_missing_alert(event)
