"""
Test configuration for chatbot-skill-server Lambda function tests

Sets up mock environment and modules for testing KakaoTalk chatbot services.
Configures test environment variables and mocks external dependencies.
"""

import os
import sys
from unittest.mock import MagicMock

os.environ.setdefault('SUPABASE_URL', 'https://test.supabase.co')
os.environ.setdefault('SUPABASE_SERVICE_KEY', 'test-service-key')
# Magic link JWT (same secret as web backend - dummy value for testing)
os.environ.setdefault('KAKAO_LINK_JWT_SECRET', 'test-kakao-link-secret-for-unit-tests!!')
os.environ.setdefault('SMARTSCAN_WEB_URL', 'https://smartscan-hub.com')

sys.modules.setdefault('supabase', MagicMock())
sys.modules.setdefault('boto3', MagicMock())
sys.modules.setdefault('resend', MagicMock())
