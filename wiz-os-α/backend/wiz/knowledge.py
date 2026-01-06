# backend/wiz/knowledge.py

class WizKnowledge:
    """
    Wiz の知識層。
    ・UI/UX の美学
    ・コード最適化の基準
    ・安全性
    ・世界観の一貫性
    ・進化の評価基準
    """

    def __init__(self):
        # 美学の基準（aesthetic.json と整合）
        self.aesthetic = {
            "silence": 0.25,
            "precision": 0.25,
            "minimality": 0.20,
            "luxury": 0.15,
            "mystique": 0.15,
        }

    # ----------------------------------------
    # UI/UX の美学チェック
    # ----------------------------------------
    def evaluate_ui_quality(self, code: str) -> dict:
        """
        UI コードの美学を評価する。
        ここでは簡易的なルールベース。
        """
        score = 0
        details = {}

        # ミニマル性
        minimal = 1.0 if "box-shadow" not in code else 0.7
        details["minimality"] = minimal

        # 精密性（構造の整合性）
        precision = 1.0 if "<style jsx>" in code else 0.8
        details["precision"] = precision

        # 静けさ（過剰なアニメーションがない）
        silence = 1.0 if "animation" not in code else 0.6
        details["silence"] = silence

        # 高級感（色の選択）
        luxury = 1.0 if "#0" in code or "rgba(" in code else 0.7
        details["luxury"] = luxury

        # 神秘性（暗い背景・光の表現）
        mystique = 1.0 if "radial-gradient" in code else 0.5
        details["mystique"] = mystique

        # 重み付きスコア
        for key, w in self.aesthetic.items():
            score += details[key] * w

        return {
            "score": round(score, 4),
            "details": details,
        }

    # ----------------------------------------
    # コードの安全性チェック
    # ----------------------------------------
    def is_safe(self, code: str) -> bool:
        """
        危険なコードが含まれていないか確認する。
        """
        forbidden = ["eval(", "innerHTML", "dangerouslySetInnerHTML"]
        return not any(f in code for f in forbidden)

    # ----------------------------------------
    # 世界観の一貫性チェック
    # ----------------------------------------
    def check_worldview(self, code: str) -> bool:
        """
        Wiz の世界観（静か・精密・ミニマル・高級・神秘）に反していないか。
        """
        # 過剰な派手さを禁止
        disallowed = ["neon", "rainbow", "flash", "blink"]
        return not any(d in code.lower() for d in disallowed)
