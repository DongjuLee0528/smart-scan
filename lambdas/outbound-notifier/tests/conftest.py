import os
import sys
from unittest.mock import MagicMock

# Set required env vars before any Lambda code is imported
os.environ.setdefault('RESEND_API_KEY', 'test-key')
os.environ.setdefault('SUPABASE_URL', 'https://test.supabase.co')
os.environ.setdefault('SUPABASE_SERVICE_KEY', 'test-service-key')

# Mock external dependencies
sys.modules.setdefault('supabase', MagicMock())
sys.modules.setdefault('boto3', MagicMock())
sys.modules.setdefault('resend', MagicMock())
