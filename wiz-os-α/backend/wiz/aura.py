# backend/wiz/aura.py

def compute_aura(state: str, vision_result, mode: str | None, profile: str = "guest"):
    """
    state: "thinking" など
    vision_result: YOLO の結果（物体数で判断）
    mode: "clip" | "yolo"
    profile: "hiroya" | "family" | "guest"
    """

    # -----------------------------
    # 1. ベース aura（物体数で決まる）
    # -----------------------------
    if vision_result is None:
        base = "calm"
    else:
        count = len(vision_result)

        if count == 0:
            base = "calm"
        elif count <= 2:
            base = "focus"
        elif count <= 5:
            base = "alert"
        else:
            base = "dim"

    # -----------------------------
    # 2. プロファイルごとの aura 調整
    # -----------------------------
    if profile == "hiroya":
        # 紘哉は “静か・精密・ミニマル”
        mapping = {
            "calm": "calm",
            "focus": "calm",   # 過剰に反応しない
            "alert": "focus",  # 少し抑える
            "dim": "dim",
        }

    elif profile == "family":
        # 家族は “柔らかく・明るく”
        mapping = {
            "calm": "calm",
            "focus": "focus",
            "alert": "alert",  # そのまま
            "dim": "focus",    # 少し明るく
        }

    else:  # guest
        # ゲストは “中立・弱め”
        mapping = {
            "calm": "calm",
            "focus": "calm",
            "alert": "focus",
            "dim": "dim",
        }

    return mapping.get(base, base)
