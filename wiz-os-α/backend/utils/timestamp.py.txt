# backend/utils/timestamp.py
from datetime import datetime, timezone


def utc_now_iso() -> str:
    """
    UTC 現在時刻を ISO 8601 文字列で返す。
    例: "2025-01-01T12:34:56.789012+00:00"
    """
    return datetime.now(timezone.utc).isoformat()
