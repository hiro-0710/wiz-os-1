from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

# メモリ上に保持する簡易 state（必要なら Redis などに置き換え可能）
WIZ_STATE = {}

class SetStateRequest(BaseModel):
    key: str
    value: dict | str | int | float | bool | None

class GetStateResponse(BaseModel):
    status: str
    state: dict

class SetStateResponse(BaseModel):
    status: str
    updated: dict


@router.get("/state", response_model=GetStateResponse)
async def get_state():
    """
    Wiz の内部状態を取得
    """
    return GetStateResponse(
        status="ok",
        state=WIZ_STATE
    )


@router.post("/state", response_model=SetStateResponse)
async def set_state(req: SetStateRequest):
    """
    Wiz の内部状態を更新
    """
    WIZ_STATE[req.key] = req.value

    return SetStateResponse(
        status="ok",
        updated={req.key: req.value}
    )
