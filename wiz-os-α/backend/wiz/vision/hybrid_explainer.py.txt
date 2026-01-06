# backend/wiz/vision/hybrid_explainer.py

from typing import List, Dict, Any
from wiz.vision.clip_engine import ClipVisionEngine
from wiz.vision.yolo_engine import YoloVisionEngine


class HybridVisualExplainer:
    """
    CLIP（意味）と YOLO（存在）を統合して、
    人間的な一文の説明にまとめるエンジン。
    """

    def __init__(self, device: str = "cpu"):
        self.clip = ClipVisionEngine(device=device)
        self.yolo = YoloVisionEngine(device=device)

    # -----------------------------
    # メイン入口
    # -----------------------------
    def explain(self, frame) -> Dict[str, Any]:
        """
        frame: base64 or PIL.Image

        return:
            {
              "clip_raw": str,
              "yolo_raw": List[...],
              "summary": str
            }
        """

        # CLIP の意味説明
        clip_desc = self.clip.describe(frame)

        # YOLO の検出結果
        yolo_det = self.yolo.detect(frame)

        # 人間的な一文に統合
        summary = self._synthesize(clip_desc, yolo_det)

        return {
            "clip_raw": clip_desc,
            "yolo_raw": yolo_det,
            "summary": summary,
        }

    # -----------------------------
    # 統合ロジック（意味 × 存在）
    # -----------------------------
    def _synthesize(self, clip_desc: str, yolo_det: List[Dict[str, Any]]) -> str:
        """
        CLIP の説明と YOLO の検出リストから、
        Wiz らしい一文を作る。
        """

        # 1. YOLO で物体の要約
        if not yolo_det:
            objects_part = "特に目立つ物体はなく、静かな景色だよ。"
        else:
            summary = {}
            for d in yolo_det:
                label = d["label"]
                summary[label] = summary.get(label, 0) + 1

            parts = []
            for label, count in summary.items():
                if count == 1:
                    parts.append(f"{label} がひとつ")
                else:
                    parts.append(f"{label} が {count} 個")

            joined = "、".join(parts)
            objects_part = f"{joined} が写っている。"

        # 2. CLIP の説明から「雰囲気」を抽出（シンプルに扱う）
        #    ここでは clip_desc 全体を “静かなコメント” として添えるだけにする
        if clip_desc:
            # Wiz らしく、CLIP の結果を前置きする
            mood_part = f"雰囲気としては「{clip_desc}」。"
        else:
            mood_part = "雰囲気の情報は少ない。"

        # 3. Wiz らしい一文に統合
        #    過剰にしゃべらず、静か・精密なトーンで
        final = f"静かに見てみたよ。{mood_part}{objects_part}"

        return final
