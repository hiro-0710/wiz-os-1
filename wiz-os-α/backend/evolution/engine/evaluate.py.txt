import re
from evolution.config.loader import load_aesthetic_config

# aesthetic.json をロード
AESTHETIC = load_aesthetic_config()


def evaluate_aesthetic(code: str, state: dict):
    """
    UI コードを解析し、Wiz の美意識に基づいてスコアを算出する。
    """

    # --- Silence（静） ---
    silence_score = evaluate_silence(code)

    # --- Precision（精密） ---
    precision_score = evaluate_precision(code)

    # --- Minimality（ミニマル） ---
    minimality_score = evaluate_minimality(code)

    # --- Luxury（高級） ---
    luxury_score = evaluate_luxury(code)

    # --- Mystique（神秘） ---
    mystique_score = evaluate_mystique(code)

    return {
        "silence": silence_score,
        "precision": precision_score,
        "minimality": minimality_score,
        "luxury": luxury_score,
        "mystique": mystique_score
    }


# ---------------------------------------------------------
# 各美意識スコアの評価関数
# ---------------------------------------------------------

def evaluate_silence(code: str) -> float:
    """
    静けさの評価：
    - アニメーションが過剰でない
    - 色彩が強すぎない
    - 透明度が適切
    """
    score = 1.0

    # 過剰なアニメーション検出
    if "animation" in code or "keyframes" in code:
        score -= 0.2

    # 不透明度が高すぎる
    opacity_matches = re.findall(r"opacity:\s*([0-9.]+)", code)
    for op in opacity_matches:
        if float(op) > 0.4:
            score -= 0.1

    return max(0.0, min(1.0, score))


def evaluate_precision(code: str) -> float:
    """
    精密さの評価：
    - インデントが整っている
    - 不要な div が少ない
    - className の乱雑さがない
    """
    score = 1.0

    # div の乱用
    div_count = code.count("<div")
    if div_count > 12:
        score -= 0.2

    # className の乱雑さ
    if "  " in code:
        score -= 0.1

    return max(0.0, min(1.0, score))


def evaluate_minimality(code: str) -> float:
    """
    ミニマルさの評価：
    - 無駄な要素が少ない
    - スタイルが簡潔
    """
    score = 1.0

    # スタイル行数が多すぎる
    style_blocks = re.findall(r"<style jsx>{`([\s\S]*?)`}</style>", code)
    for block in style_blocks:
        if len(block.split("\n")) > 80:
            score -= 0.2

    return max(0.0, min(1.0, score))


def evaluate_luxury(code: str) -> float:
    """
    高級感の評価：
    - ガラス質感（blur, rgba）が適切
    - 余白が美しい
    """
    score = 1.0

    # blur が理想値から離れている
    if "blur(" in code:
        blur_values = re.findall(r"blur\((\d+)px\)", code)
        for b in blur_values:
            diff = abs(int(b) - AESTHETIC["style_targets"]["preferred_blur"])
            if diff > 10:
                score -= 0.1

    return max(0.0, min(1.0, score))


def evaluate_mystique(code: str) -> float:
    """
    神秘性の評価：
    - 光の扱いが繊細
    - 透明度と影のバランス
    """
    score = 1.0

    # box-shadow が強すぎる
    if "box-shadow" in code:
        score -= 0.1

    return max(0.0, min(1.0, score))
