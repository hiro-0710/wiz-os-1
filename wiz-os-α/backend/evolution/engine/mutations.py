import re
import random
from evolution.config.loader import load_aesthetic_config

AESTHETIC = load_aesthetic_config()


def generate_mutations(code: str, scores: dict):
    """
    現在の UI コードをもとに、美意識に沿った改善案（mutation）を生成する。
    変化は小さく、静かで、繊細であることが前提。
    """

    mutations = []

    # --- Opacity 調整 ---
    mutations.append(adjust_opacity(code))

    # --- Blur 調整 ---
    mutations.append(adjust_blur(code))

    # --- Border Alpha 調整 ---
    mutations.append(adjust_border_alpha(code))

    # --- Padding / Margin の微調整 ---
    mutations.append(adjust_spacing(code))

    # --- Shadow の弱体化（静けさ向上） ---
    mutations.append(reduce_shadow(code))

    # --- 不要な div の削減（ミニマル化） ---
    mutations.append(remove_redundant_div(code))

    # None を除外
    return [m for m in mutations if m is not None]


# ---------------------------------------------------------
# Mutation Functions
# ---------------------------------------------------------

def adjust_opacity(code: str):
    """
    opacity を美意識の理想値に近づける。
    """
    target = AESTHETIC["style_targets"]["preferred_opacity"]

    match = re.search(r"opacity:\s*([0-9.]+)", code)
    if not match:
        return None

    current = float(match.group(1))
    delta = (target - current) * 0.3  # 小さく動かす
    new_value = round(current + delta, 3)

    return code.replace(f"opacity: {current}", f"opacity: {new_value}")


def adjust_blur(code: str):
    """
    blur(px) を理想値に近づける。
    """
    target = AESTHETIC["style_targets"]["preferred_blur"]

    match = re.search(r"blur\((\d+)px\)", code)
    if not match:
        return None

    current = int(match.group(1))
    delta = int((target - current) * 0.25)
    new_value = current + delta

    return code.replace(f"blur({current}px)", f"blur({new_value}px)")


def adjust_border_alpha(code: str):
    """
    rgba の alpha を理想値に近づける。
    """
    target = AESTHETIC["style_targets"]["preferred_border_alpha"]

    match = re.search(r"rgba\(255,\s*255,\s*255,\s*([0-9.]+)\)", code)
    if not match:
        return None

    current = float(match.group(1))
    delta = (target - current) * 0.3
    new_value = round(current + delta, 3)

    return code.replace(
        f"rgba(255, 255, 255, {current})",
        f"rgba(255, 255, 255, {new_value})"
    )


def adjust_spacing(code: str):
    """
    padding や margin を微調整して、余白の美しさを整える。
    """
    match = re.search(r"padding:\s*(\d+)px", code)
    if not match:
        return None

    current = int(match.group(1))
    delta = random.choice([-1, 1])  # 微調整
    new_value = max(0, current + delta)

    return code.replace(f"padding: {current}px", f"padding: {new_value}px")


def reduce_shadow(code: str):
    """
    box-shadow が強すぎる場合、静けさのために弱める。
    """
    match = re.search(r"box-shadow:\s*0\s*0\s*(\d+)px", code)
    if not match:
        return None

    current = int(match.group(1))
    new_value = max(0, current - 2)

    return code.replace(
        f"box-shadow: 0 0 {current}px",
        f"box-shadow: 0 0 {new_value}px"
    )


def remove_redundant_div(code: str):
    """
    不要な <div> を削減してミニマル化。
    """
    # div が少なければ何もしない
    if code.count("<div") < 8:
        return None

    # 最初の不要 div を削除
    return code.replace("<div>", "", 1)
