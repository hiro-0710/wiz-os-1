# backend/evolution/config/loader.py
import json
import os
from functools import lru_cache
from typing import Any, Dict

CONFIG_DIR = os.path.dirname(__file__)
AESTHETIC_PATH = os.path.join(CONFIG_DIR, "aesthetic.json")


@lru_cache(maxsize=1)
def load_aesthetic_config() -> Dict[str, Any]:
    """
    Wiz の美意識設定を読み込む。
    ファイルは一度だけ読み、以降はキャッシュから返す。
    """
    if not os.path.exists(AESTHETIC_PATH):
        raise FileNotFoundError(f"aesthetic.json not found at {AESTHETIC_PATH}")

    with open(AESTHETIC_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    return data


def get_axes_weights() -> Dict[str, float]:
    """
    各審美軸の weight を取り出す。
    例: {"silence": 0.24, "precision": 0.22, ...}
    """
    cfg = load_aesthetic_config()
    axes = cfg.get("axes", {})
    return {key: float(spec.get("weight", 0.0)) for key, spec in axes.items()}


def get_thresholds() -> Dict[str, float]:
    """
    受容 / 強い受容 / 拒否の閾値を返す。
    """
    cfg = load_aesthetic_config()
    thresholds = cfg.get("thresholds", {})
    return {
        "accept": float(thresholds.get("accept", 0.7)),
        "strong_accept": float(thresholds.get("strong_accept", 0.85)),
        "reject": float(thresholds.get("reject", 0.5)),
    }
