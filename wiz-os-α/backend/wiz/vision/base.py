# backend/wiz/vision/base.py

from abc import ABC, abstractmethod
from PIL import Image
import base64
import io


class VisionEngineBase(ABC):
    """
    Wiz の視覚知性の基底クラス。
    CLIP（意味）と YOLO（存在）を統合するための共通インターフェース。
    """

    def __init__(self, mode="auto"):
        # mode = "clip" | "yolo" | "auto"
        self.mode = mode

    # ----------------------------------------
    # 画像のデコード（base64 → PIL Image）
    # ----------------------------------------
    def decode_frame(self, frame):
        if isinstance(frame, Image.Image):
            return frame

        if isinstance(frame, str) and frame.startswith("data:image"):
            header, encoded = frame.split(",", 1)
            img_bytes = base64.b64decode(encoded)
            return Image.open(io.BytesIO(img_bytes)).convert("RGB")

        raise ValueError("Invalid frame format")

    # ----------------------------------------
    # 前処理（各エンジンで実装）
    # ----------------------------------------
    @abstractmethod
    def process_frame(self, frame):
        pass

    # ----------------------------------------
    # 意味分類（CLIP）
    # ----------------------------------------
    @abstractmethod
    def classify(self, frame):
        pass

    # ----------------------------------------
    # 物体検出（YOLO）
    # ----------------------------------------
    @abstractmethod
    def detect(self, frame):
        pass

    # ----------------------------------------
    # 説明（各エンジンで実装）
    # ----------------------------------------
    @abstractmethod
    def describe(self, frame):
        pass

    # ----------------------------------------
    # モード切替
    # ----------------------------------------
    def set_mode(self, mode):
        """
        mode: "clip" | "yolo" | "auto"
        """
        self.mode = mode

    # ----------------------------------------
    # 自動判定（auto モード）
    # ----------------------------------------
    def auto_select(self, text):
        """
        入力テキストから最適な視覚モードを自動選択する。
        """
        t = text.lower()

        # YOLO が適切な意図
        if any(k in t for k in ["何が写ってる", "物体", "検出", "どこに"]):
            return "yolo"

        # CLIP が適切な意図
        if any(k in t for k in ["雰囲気", "意味", "美学", "どう見える"]):
            return "clip"

        # デフォルトは CLIP（Wiz の世界観に合う）
        return "clip"

    # ----------------------------------------
    # メイン処理
    # ----------------------------------------
    def run(self, text, frame):
        """
        text: ユーザーの意図
        frame: base64 or PIL Image
        """

        img = self.decode_frame(frame)

        # モード決定
        if self.mode == "auto":
            mode = self.auto_select(text)
        else:
            mode = self.mode

        # 実行
        if mode == "clip":
            return self.classify(img), "clip"

        if mode == "yolo":
            return self.detect(img), "yolo"

        raise ValueError("Invalid mode")
