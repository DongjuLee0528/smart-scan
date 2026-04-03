import os
from supabase import create_client, Client


def get_client() -> Client:
    # 환경변수: SUPABASE_URL, SUPABASE_SERVICE_KEY
    return create_client(
        os.environ.get('SUPABASE_URL'),
        os.environ.get('SUPABASE_SERVICE_KEY'),
    )
