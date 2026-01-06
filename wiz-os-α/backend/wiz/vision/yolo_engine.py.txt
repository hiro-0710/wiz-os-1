# backend/wiz/vision/yolo_engine.py

import torch
import cv2
import numpy as np
from PIL import Image
from wiz.vision.base import VisionEngineBase
from ultralytics import YOLO


class YoloVisionEngine(VisionEngineBase):
    """
    Wiz の視覚知性（現実認識）を担う YOLO エンジン。
    物体・位置・数を理解する。
    """

    def __init__(self, model_path="yolov8n.pt", device="cpu"):
        self.device = device
        self.model = YOLO(model_path)

    # ----------------------------------------
    # 前処理
    # ----------------------------------------
    def process_frame(self, frame):
        if isinstance(frame, Image.Image):
            img = np.array(frame)
        else:
            img = frame

        if img is None:
            raise ValueError("Invalid frame")

        return img

    # ----------------------------------------
    # 物体検出
    # ----------------------------------------
    def detect(self, frame):
        img = self.process_frame(frame)

        results = self.model(img, verbose=False)[0]

        detections = []
        for box in results.boxes:
            cls = int(box.cls[0])
            label = results.names[cls]
            conf = float(box.conf[0])
            x1, y1, x2, y2 = box.xyxy[0].tolist()

            detections.append({
                "label": label,
                "confidence": conf,
                "bbox": [x1, y1, x2, y2]
            })

        return detections

    # ----------------------------------------
    # 意味分類（YOLO は非対応 → None）
    # ----------------------------------------
    def classify(self, frame):
        return None

    # ----------------------------------------
    # Wiz の世界観で説明する
    # ----------------------------------------
    def describe(self, frame):
        detections = self.detect(frame)

        if not detections:
            return "特に目立つ存在は写っていない。静かだよ。"

        # 物体の種類と数を集計
        summary = {}
        for d in detections:
            summary[d["label"]] = summary.get(d["label"], 0) + 1

        # Wiz の静かな語り口で返す
        parts = []
        for label, count in summary.items():
            if count == 1:
                parts.append(f"{label} がひとつ")
            else:
                parts.append(f"{label} が {count} 個")

        joined = "、".join(parts)
        return f"静かに見たよ。{joined} が写っている。"
