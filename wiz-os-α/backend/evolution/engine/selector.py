from evolution.config.loader import load_aesthetic_config

AESTHETIC = load_aesthetic_config()


def select_best(mutations: list[str], scores: dict):
    """
    フィルタを通過した mutation の中から、
    最も美意識に合う案を選ぶ。
    """

    if not mutations:
        return None

    ranked = []

    for m in mutations:
        score = evaluate_mutation_quality(m, scores)
        ranked.append((score, m))

    # スコアが高い順に並べる
    ranked.sort(key=lambda x: x[0], reverse=True)

    # 最も美しい mutation を返す
    return ranked[0][1]


# ---------------------------------------------------------
# Mutation の美意識適合度を評価
# ---------------------------------------------------------

def evaluate_mutation_quality(code: str, base_scores: dict) -> float:
    """
    mutation がどれだけ美意識に合っているかを評価する。
    進化前のスコア（base_scores）を基準に、
    どれだけ改善されているかを見る。
    """

    # mutation が含む特徴を簡易的に評価
    delta = 0.0

    # opacity が理想値に近づくほど良い
    if "opacity:" in code:
        delta += 0.05

    # blur が理想値に近づくほど良い
    if "blur(" in code:
        delta += 0.05

    # alpha が理想値に近づくほど良い
    if "rgba(255, 255, 255" in code:
        delta += 0.04

    # spacing の微調整は控えめに評価
    if "padding:" in code or "margin:" in code:
        delta += 0.02

    # shadow の弱体化は静けさ向上
    if "box-shadow" in code:
        delta += 0.03

    # 総合スコア（base + delta）
    total = (
        base_scores["silence"] * AESTHETIC["weights"]["silence"] +
        base_scores["precision"] * AESTHETIC["weights"]["precision"] +
        base_scores["minimality"] * AESTHETIC["weights"]["minimality"] +
        base_scores["luxury"] * AESTHETIC["weights"]["luxury"] +
        base_scores["mystique"] * AESTHETIC["weights"]["mystique"]
    )

    return total + delta
