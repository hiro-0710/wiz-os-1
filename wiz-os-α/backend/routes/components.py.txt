from fastapi import APIRouter
from pydantic import BaseModel

from evolution.vfs import read_file, write_file

router = APIRouter()

class ComponentRequest(BaseModel):
    component: str

class SaveComponentRequest(BaseModel):
    component: str
    code: str

class ComponentResponse(BaseModel):
    status: str
    code: str | None = None


@router.get("/component", response_model=ComponentResponse)
async def get_component(component: str):
    """
    コンポーネントコードを VFS から取得
    """
    try:
        code = read_file(f"{component}.tsx")
        return ComponentResponse(status="ok", code=code)
    except FileNotFoundError:
        return ComponentResponse(status="not-found", code=None)


@router.post("/component", response_model=ComponentResponse)
async def save_component(req: SaveComponentRequest):
    """
    コンポーネントコードを VFS に保存
    """
    write_file(f"{req.component}.tsx", req.code)
    return ComponentResponse(status="ok", code=req.code)
