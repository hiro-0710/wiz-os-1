from fastapi import APIRouter
from pydantic import BaseModel

from evolution.vfs import write_file
from evolution.vfs_versioning import get_history, rollback
from evolution.engine.diff import generate_diff

router = APIRouter()

class RollbackRequest(BaseModel):
    component: str
    version_index: int

class RollbackResponse(BaseModel):
    status: str
    rolled_code: str | None = None
    diff: str | None = None


@router.post("/rollback-ui", response_model=RollbackResponse)
async def rollback_ui(req: RollbackRequest):

    history = get_history(req.component)

    # index が不正なら拒否
    if req.version_index < 0 or req.version_index >= len(history):
        return RollbackResponse(status="invalid-index")

    # ロールバック対象
    entry = history[req.version_index]
    old_code = entry["old_code"]
    new_code = entry["new_code"]

    # 差分（戻す方向）
    diff = generate_diff(new_code, old_code)

    # VFS に書き戻す
    write_file(f"{req.component}.tsx", old_code)

    return RollbackResponse(
        status="ok",
        rolled_code=old_code,
        diff=diff
    )
