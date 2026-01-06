import os
import json
from datetime import datetime

HISTORY_ROOT = "vfs_history"
os.makedirs(HISTORY_ROOT, exist_ok=True)


def _history_path(component: str) -> str:
    """
    コンポーネントごとの履歴ファイルパスを返す。
    """
    return os.path.join(HISTORY_ROOT, f"{component}.json")


def save_history(component: str, old_code: str, new_code: str, diff: str, scores: dict, proposal: str):
    """
    進化履歴を保存する。
    - old_code: 進化前
    - new_code: 進化後
    - diff: 差分
    - scores: 美意識スコア
    - proposal: 採用された mutation
    """

    path = _history_path(component)

    # 既存履歴を読み込み
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            history = json.load(f)
    else:
        history = []

    entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "old_code": old_code,
        "new_code": new_code,
        "diff": diff,
        "scores": scores,
        "proposal": proposal
    }

    history.append(entry)

    # 保存
    with open(path, "w", encoding="utf-8") as f:
        json.dump(history, f, indent=2, ensure_ascii=False)


def get_history(component: str):
    """
    コンポーネントの進化履歴を取得する。
    """
    path = _history_path(component)

    if not os.path.exists(path):
        return []

    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def rollback(component: str, index: int):
    """
    指定 index の old_code を返す（実際の書き戻しは routes 側で行う）。
    """
    history = get_history(component)

    if index < 0 or index >= len(history):
        return None

    return history[index]["old_code"]
