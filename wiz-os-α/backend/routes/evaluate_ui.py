from fastapi import APIRouter
from pydantic import BaseModel

from evolution.engine.evaluate import evaluate_aesthetic

router = APIRouter()

class EvaluateRequest(BaseModel):
    code: str
    state: dict | None = {}

class EvaluateResponse(BaseModel):
    status: str
    score: float
    details: dict


@router.post("/evaluate-ui", response_model=EvaluateResponse)
async def evaluate_ui(req: EvaluateRequest):

    # 美意識スコアを算出
    scores = evaluate_aesthetic(req.code, req.state or {})

    # 総合スコア（重み付け平均などは後で調整可能）
    total = (
        scores["silence"] * 0.28 +
        scores["precision"] * 0.22 +
        scores["minimality"] * 0.20 +
        scores["luxury"] * 0.18 +
        scores["mystique"] * 0.12
    )

    return EvaluateResponse(
        status="ok",
        score=total,
        details=scores
    )
