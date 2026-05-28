"""
Firebase configuration and initialization module

Handles Firebase Admin SDK initialization for the Smart Scan system.
Manages Firebase app instance and credentials for Firebase Cloud Messaging (FCM).

Features:
- Firebase Admin SDK initialization with service account credentials
- Environment-based configuration management
- Singleton pattern for Firebase app instance
- Error handling for missing credentials
"""

import json
import logging
import os
from typing import Optional

import firebase_admin
from firebase_admin import credentials

logger = logging.getLogger(__name__)

_firebase_app: Optional[firebase_admin.App] = None


def get_firebase_app() -> firebase_admin.App:
    global _firebase_app

    if _firebase_app is not None:
        return _firebase_app

    try:
        firebase_credentials_json = os.getenv("FIREBASE_CREDENTIALS_JSON")

        if not firebase_credentials_json:
            raise ValueError("FIREBASE_CREDENTIALS_JSON environment variable is not set")

        credentials_dict = json.loads(firebase_credentials_json)
        cred = credentials.Certificate(credentials_dict)

        _firebase_app = firebase_admin.initialize_app(cred)
        logger.info("Firebase Admin SDK initialized successfully")

        return _firebase_app

    except json.JSONDecodeError as e:
        logger.error("Failed to parse Firebase credentials JSON: %s", e)
        raise ValueError("Invalid Firebase credentials JSON format") from e
    except Exception as e:
        logger.error("Failed to initialize Firebase Admin SDK: %s", e)
        raise


def is_firebase_initialized() -> bool:
    return _firebase_app is not None