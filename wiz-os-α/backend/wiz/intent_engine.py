# backend/wiz/intent_engine.py

from fastapi import APIRouter
from pydantic import BaseModel

from wiz.vision.clip_engine import ClipVisionEngine
from wiz.vision.yolo_engine import YoloVisionEngine
from wiz.vision.base import VisionEngineBase
from wiz.vision.hybrid_explainer import HybridVisualExplainer

from wiz.knowledge import retrieve_knowledge
from wiz.aura import compute_aura

from wiz.profiles.profile_engine import ProfileEngine


router = APIRouter()

# Vision engines
clip_engine = ClipVisionEngine(device="cpu")
yolo_engine = YoloVisionEngine(device="cpu")
vision_engine = VisionEngineBase(mode="auto")
hybrid_explainer = HybridVisualExplainer(device="cpu")

# Profile engine
profile_engine = ProfileEngine()


# ---------------------------------------------------------
# Request / Response Models
# ---------------------------------------------------------
class IntentRequest(BaseModel):
    intent: str
    frame: str | None = None
    vision_mode: str | None = None


class IntentResponse(BaseModel):
    message: str
    state: str
    aura: str
    profile: str
    confidence: float


# ---------------------------------------------------------
# Intent Classification
# ---------------------------------------------------------
def classify_intent(text: str):
    t = text.lower()

    if any(k in t for k in ["ちゃんと見て", "しっかり見て", "全体を見て"]):
        return "vision_hybrid"

    if any(k in t for k in ["何が写ってる", "物体", "検出", "どこに"]):
        return "vision_yolo"

    if any(k in t for k in ["見て", "どう見える", "雰囲気", "意味"]):
        return "vision_clip"

    if any(k in t for k in ["なぜ", "原理", "仕組み"]):
        return "principle"

    if any(k in t for k in ["どうやって", "方法", "手順"]):
        return "method"

    if any(k in t for k in ["意味", "定義"]):
        return "definition"

    return "unknown"


def structure_intent(text: str):
    return {
        "intent_type": classify_intent(text),
        "topic": "general",
        "depth": "neutral",
        "emotion": "neutral",
        "keywords": []
    }


# ---------------------------------------------------------
# Vision Handlers
# ---------------------------------------------------------
def handle_vision(text, frame, mode):
    if frame is None:
        return "視覚情報が届いていない。もう一度送って。", None, None

    vision_engine.set_mode(mode)
    result, used_mode = vision_engine.run(text, frame)

    if used_mode == "clip":
        return f"静かに見たよ。{result}", result, "clip"

    if used_mode == "yolo":
        if not result:
            return "特に目立つ存在は写っていない。静かだよ。", result, "yolo"

        summary = {}
        for d in result:
            summary[d["label"]] = summary.get(d["label"], 0) + 1

        parts = []
        for label, count in summary.items():
            if count == 1:
                parts.append(f"{label} がひとつ")
            else:
                parts.append(f"{label} が {count} 個")

        joined = "、".join(parts)
        return f"静かに見たよ。{joined} が写っている。", result, "yolo"

    return "視覚処理に少し乱れがあった。", None, None


def handle_vision_hybrid(frame):
    if frame is None:
        return "視覚情報が届いていない。もう一度送って。", None, None

    result = hybrid_explainer.explain(frame)

    summary = result["summary"]
    yolo_raw = result["yolo_raw"]

    return summary, yolo_raw, "yolo"


# ---------------------------------------------------------
# Response Synthesis (profile-aware)
# ---------------------------------------------------------
def synthesize_response(text, structured, knowledge_text, profile):
    if profile == "hiroya":
        prefix = "精密に整理するね。"
        style = lambda msg: msg

    elif profile == "family":
        prefix = "やさしく説明するね。"
        style = lambda msg: msg.replace("。", "ね。")

    else:
        prefix = "静かに考えてみたよ。"
        style = lambda msg: msg

    base = f"{prefix}{knowledge_text}"
    return style(base)


# ---------------------------------------------------------
# Main Intent Interpreter
# ---------------------------------------------------------
@router.post("/intent", response_model=IntentResponse)
async def interpret(req: IntentRequest):

    # 1. Predict profile
    profile_info = profile_engine.predict(req.intent)
    profile = profile_info["profile"]
    confidence = profile_info["confidence"]

    # 2. Update profile (learning)
    profile_engine.update_profile(profile, req.intent)

    # 3. Structure intent
    structured = structure_intent(req.intent)
    intent_type = structured["intent_type"]

    # 4. Vision Hybrid
    if intent_type == "vision_hybrid":
        message, vision_result, used_mode = handle_vision_hybrid(req.frame)

        aura = compute_aura(
            state="thinking",
            vision_result=vision_result,
            mode=used_mode,
            profile=profile
        )

        return IntentResponse(
            message=message,
            state="thinking",
            aura=aura,
            profile=profile,
            confidence=confidence
        )

    # 5. Vision (clip / yolo)
    if intent_type in ["vision_clip", "vision_yolo"]:
        mode = "clip" if intent_type == "vision_clip" else "yolo"

        if req.vision_mode in ["clip", "yolo", "auto"]:
            mode = req.vision_mode

        message, vision_result, used_mode = handle_vision(
            req.intent, req.frame, mode
        )

        aura = compute_aura(
            state="thinking",
            vision_result=vision_result,
            mode=used_mode,
            profile=profile
        )

        return IntentResponse(
            message=message,
            state="thinking",
            aura=aura,
            profile=profile,
            confidence=confidence
        )

    # 6. Knowledge-based response
    knowledge_text = retrieve_knowledge(structured)
    message = synthesize_response(req.intent, structured, knowledge_text, profile)

    aura = compute_aura(
        state="thinking",
        vision_result=None,
        mode=None,
        profile=profile
    )

    return IntentResponse(
        message=message,
        state="thinking",
        aura=aura,
        profile=profile,
        confidence=confidence
    )
