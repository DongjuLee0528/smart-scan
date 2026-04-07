import os
import sys
from unittest.mock import MagicMock

os.environ.setdefault('RESEND_API_KEY', 'test-key')
os.environ.setdefault('SUPABASE_URL', 'https://test.supabase.co')
os.environ.setdefault('SUPABASE_SERVICE_KEY', 'test-service-key')

sys.modules.setdefault('supabase', MagicMock())
sys.modules.setdefault('boto3', MagicMock())
sys.modules.setdefault('resend', MagicMock())
