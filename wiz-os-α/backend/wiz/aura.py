from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/ui/state")
async def get_ui_state(request: Request):
    base_url = str(request.base_url).rstrip("/")

    def full_url(path: str) -> str:
        if path.startswith("http"):
            return path
        return f"{base_url}{path}"

    return JSONResponse({
        "aura": full_url("/images/aura.png"),
        "profile": full_url("/images/profile.png"),
        "hud": full_url("/images/hud.png"),
        "orb": full_url("/images/orb.png"),
    })
