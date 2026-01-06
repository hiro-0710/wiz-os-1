# backend/wiz/profiles/profile_engine.py

import json
import os
from typing import Dict, Any


class ProfileEngine:
    """
    個人識別は行わず、
    ・声の特徴（高さ・テンポ）
    ・言葉遣い
    ・よく使う機能
    ・会話の傾向
    などから “プロファイルに近さ” を推定する安全なエンジン。
    """

    def __init__(self, profile_path="backend/wiz/profiles/profiles.json"):
        self.profile_path = profile_path
        self.profiles = self._load_profiles()

    # ----------------------------------------
    # プロファイル読み込み
    # ----------------------------------------
    def _load_profiles(self) -> Dict[str, Any]:
        if not os.path.exists(self.profile_path):
            return {}

        with open(self.profile_path, "r", encoding="utf-8") as f:
            return json.load(f)

    # ----------------------------------------
    # プロファイル保存
    # ----------------------------------------
    def _save_profiles(self):
        with open(self.profile_path, "w", encoding="utf-8") as f:
            json.dump(self.profiles, f, ensure_ascii=False, indent=2)

    # ----------------------------------------
    # 特徴量抽出（安全な範囲）
    # ----------------------------------------
    def extract_features(self, text: str) -> Dict[str, float]:
        """
        text（ユーザーの発話）から特徴を抽出する。
        個人識別ではなく、話し方の傾向を数値化するだけ。
        """

        features = {
            "politeness": 0.0,   # 丁寧さ
            "technical": 0.0,    # 技術的な語彙
            "casual": 0.0,       # カジュアルさ
            "shortness": 0.0,    # 短文傾向
        }

        t = text.lower()

        # 丁寧さ
        if any(k in t for k in ["です", "ます", "お願いします"]):
            features["politeness"] += 1.0

        # 技術ワード
        if any(k in t for k in ["api", "model", "deploy", "vision", "clip", "yolo"]):
            features["technical"] += 1.0

        # カジュアル
        if any(k in t for k in ["うい", "おけ", "了解", "まかせる"]):
            features["casual"] += 1.0

        # 短文
        if len(text) <= 5:
            features["shortness"] += 1.0

        return features

    # ----------------------------------------
    # プロファイルとの距離を計算
    # ----------------------------------------
    def _distance(self, f1: Dict[str, float], f2: Dict[str, float]) -> float:
        dist = 0.0
        for k in f1:
            dist += abs(f1[k] - f2.get(k, 0.0))
        return dist

    # ----------------------------------------
    # プロファイル推定
    # ----------------------------------------
    def predict(self, text: str) -> Dict[str, Any]:
        """
        入力された発話から、最も近いプロファイルを推定する。
        """

        if not self.profiles:
            return {"profile": "guest", "confidence": 0.0}

        features = self.extract_features(text)

        best_profile = None
        best_distance = 9999

        for name, data in self.profiles.items():
            dist = self._distance(features, data["features"])
            if dist < best_distance:
                best_distance = dist
                best_profile = name

        confidence = max(0.0, 1.0 - best_distance / 5.0)

        return {
            "profile": best_profile,
            "confidence": round(confidence, 3),
        }

    # ----------------------------------------
    # プロファイル更新（学習）
    # ----------------------------------------
    def update_profile(self, name: str, text: str):
        """
        発話から特徴を抽出し、既存プロファイルに加算していく。
        """

        new_features = self.extract_features(text)

        if name not in self.profiles:
            self.profiles[name] = {"features": new_features}
        else:
            old = self.profiles[name]["features"]
            for k in old:
                old[k] = (old[k] * 0.8) + (new_features[k] * 0.2)

        self._save_profiles()
