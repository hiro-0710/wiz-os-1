# backend/wiz/vision/clip_engine.py

import torch
from PIL import Image
from torchvision import transforms
from wiz.vision.base import VisionEngineBase
import clip


class ClipVisionEngine(VisionEngineBase):
    """
    Wiz の視覚知性（意味理解）を担う CLIP エンジン。
    抽象・美学・雰囲気を理解する。
    """

    def __init__(self, device="cpu"):
        self.device = device
        self.model, self.preprocess = clip.load("ViT-B/32", device=device)

        # Wiz の世界観に合わせた “意味ラベル”
        self.labels = [
            "ミニマル",
            "未来的",
            "静か",
            "高級感",
            "神秘的",
            "暖かい",
            "冷たい",
            "混沌",
            "秩序",
            "自然",
            "人工的",
        ]

    # ----------------------------------------
    # 前処理
    # ----------------------------------------
    def process_frame(self, frame):
        if isinstance(frame, Image.Image):
            img = frame
        else:
            img = Image.fromarray(frame)
        return self.preprocess(img).unsqueeze(0).to(self.device)

    # ----------------------------------------
    # 画像分類（意味理解）
    # ----------------------------------------
    def classify(self, frame):
        image_tensor = self.process_frame(frame)
        text_tokens = clip.tokenize(self.labels).to(self.device)

        with torch.no_grad():
            image_features = self.model.encode_image(image_tensor)
            text_features = self.model.encode_text(text_tokens)

            logits = (image_features @ text_features.T).softmax(dim=-1)
            probs = logits[0].cpu().tolist()

        best_idx = probs.index(max(probs))
        return {
            "label": self.labels[best_idx],
            "confidence": probs[best_idx]
        }

    # ----------------------------------------
    # 物体検出（CLIP は非対応 → None）
    # ----------------------------------------
    def detect(self, frame):
        return None

    # ----------------------------------------
    # Wiz の世界観で説明する
    # ----------------------------------------
    def describe(self, frame):
        result = self.classify(frame)
        label = result["label"]

        # Wiz の静かな語り口で返す
        descriptions = {
            "ミニマル": "余白が呼吸している。静かに整っている。",
            "未来的": "線が先へ伸びている。まだ見ぬ形を示している。",
            "静か": "音が消えている。空気が澄んでいる。",
            "高級感": "素材が語っている。光が深い。",
            "神秘的": "輪郭が曖昧で、意味が揺れている。",
            "暖かい": "光が柔らかい。空気が近い。",
            "冷たい": "輪郭が硬い。距離がある。",
            "混沌": "情報が散っている。まだ形になっていない。",
            "秩序": "構造が整っている。静かに並んでいる。",
            "自然": "人工の線がない。呼吸している。",
            "人工的": "人の手の跡がある。意図が強い。",
        }

        return descriptions.get(label, "静かに佇んでいる。")
