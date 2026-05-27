"""
Database client wrapper for remote-alert Lambda function

Provides Supabase database connection by importing from shared Lambda module.
Used for user authentication, family data lookup, and notification storage.
"""

from lambda_shared.database import get_client
