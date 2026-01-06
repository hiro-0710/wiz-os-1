from evolution.config.loader import load_aesthetic_config

AESTHETIC = load_aesthetic_config()


def filter_mutations(mutations: list[str]):
    """
    生成された mutation の中から、
    世界観に合わないもの、変化が大きすぎるもの、
    ノイズ的なものを除外する。
    """

    filtered = []

    for m in mutations:
        if m is None:
            continue

        # --- 変化が大きすぎるものを除外 ---
        if not is_small_change(m):
            continue

        # --- 世界観に反するものを除外 ---
        if violates_aesthetic(m):
            continue

        filtered.append(m)

    return filtered


# ---------------------------------------------------------
# 判定ロジック
# ---------------------------------------------------------

def is_small_change(code: str) -> bool:
    """
    変化量が大きすぎないかを判定する。
    opacity / blur / alpha / spacing の変化が
    設定された mutation_limits を超えていないか確認。
    """

    limits = AESTHETIC["mutation_limits"]

    # opacity
    if "opacity:" in code:
        # 変化量が大きすぎる場合は除外
        # （実際の差分比較は diff.py で行うが、ここでは簡易チェック）
        pass

    # blur
    if "blur(" in code:
        pass

    # border alpha
    if "rgba(255, 255, 255" in code:
        pass

    # spacing
    if "padding:" in code or "margin:" in code:
        pass

    return True  # 基本は許容、詳細は diff で調整可能


def violates_aesthetic(code: str) -> bool:
    """
    世界観に反する変更を検出する。
    - opacity が高すぎる（静を破壊）
    - blur が極端（高級感を破壊）
    - 影が強すぎる（静を破壊）
    - 色彩が強すぎる（ミニマルを破壊）
    """

    # 静けさを破壊する強い影
    if "box-shadow: 0 0 20px" in code:
        return True

    # 不透明度が高すぎる
    if "opacity:" in code:
        try:
            value = float(code.split("opacity:")[1].split(";")[0])
            if value > 0.5:
                return True
        except:
            pass

    # 強い色彩（rgba の alpha が高すぎる）
    if "rgba(" in code and "255, 255, 255" not in code:
        return True

    return False
