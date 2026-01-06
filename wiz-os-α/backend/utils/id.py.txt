# backend/utils/id.py
import uuid


def new_id() -> str:
    """
    ランダムな UUID v4 を文字列として返す。
    Wiz 内部でのセッション ID / エントリ ID に使う。
    """
    return str(uuid.uuid4())
