"""
Database client wrapper for chatbot-skill-server Lambda function

Provides Supabase database connection by importing from shared Lambda module.
Used for device registration, item management, and user data operations in chatbot.
"""

from lambda_shared.database import get_client
