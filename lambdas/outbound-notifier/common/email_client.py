"""
Email client wrapper for outbound-notifier Lambda function

Provides email sending functionality by importing from shared Lambda module.
Used for sending missing item alert and return home notification emails.
"""

from lambda_shared.email_client import send_email
