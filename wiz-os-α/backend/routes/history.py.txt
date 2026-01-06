from fastapi import APIRouter
from pydantic import BaseModel

from evolution.vfs_versioning import get_history

router = APIRouter()

class HistoryResponse(BaseModel):
    status: str
    history: list

@router.get("/history", response_model=HistoryResponse)
async def history(component: str):

    history = get_history(component)

    return HistoryResponse(
        status="ok",
        history=history
    )
