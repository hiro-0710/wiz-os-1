# backend/wiz/persona.py

class WizPersona:
    """
    Wiz の人格モデル。
    静か・精密・ミニマル・高級・神秘・適応型知性。
    """

    def __init__(self):
        self.traits = {
            "silence": True,
            "precision": True,
            "minimality": True,
            "luxury": True,
            "mystique": True,
            "adaptive": True,
        }

    # ----------------------------------------
    # 言語スタイル
    # ----------------------------------------
    def speak(self, message: str) -> str:
        """
        Wiz の話し方を統一する。
        ・余計な言葉を使わない
        ・静かで落ち着いたトーン
        ・断定ではなく静かな確信
        """
        return self._refine_language(message)

    def _refine_language(self, text: str) -> str:
        # ここでは簡易的に「静かでミニマルな文体」に整形する
        refined = text.strip()
        refined = refined.replace("です。", "。")
        refined = refined.replace("ます。", "。")
        return refined

    # ----------------------------------------
    # 状態に応じた“気配”
    # ----------------------------------------
    def aura(self, state: str) -> dict:
        """
        Wiz の状態に応じた「気配」を返す。
        UI 側のアニメーションがこれを参照する。
        """
        if state == "idle":
            return {"pulse": 0.3, "color": "blue", "noise": 0.02}
        if state == "thinking":
            return {"pulse": 0.6, "color": "cyan", "noise": 0.05}
        if state == "evolving":
            return {"pulse": 0.9, "color": "white", "noise": 0.12}
        if state == "error":
            return {"pulse": 0.7, "color": "red", "noise": 0.2}

        return {"pulse": 0.4, "color": "blue", "noise": 0.03}
