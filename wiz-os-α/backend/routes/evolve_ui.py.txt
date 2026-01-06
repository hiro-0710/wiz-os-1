from fastapi import APIRouter
from pydantic import BaseModel

from evolution.vfs import read_file, write_file
from evolution.vfs_versioning import save_history
from evolution.engine.evaluate import evaluate_aesthetic
from evolution.engine.mutations import generate_mutations
from evolution.engine.filter import filter_mutations
from evolution.engine.selector import select_best
from evolution.engine.codegen import generate_code
from evolution.engine.diff import generate_diff

router = APIRouter()

class EvolutionRequest(BaseModel):
    component: str
    current_code: str
    state: dict

class EvolutionResponse(BaseModel):
    status: str
    new_code: str | None = None
    diff: str | None = None


@router.post("/evolve-ui", response_model=EvolutionResponse)
async def evolve_ui(req: EvolutionRequest):

    # 1. 現在の UI を評価
    scores = evaluate_aesthetic(req.current_code, req.state)

    # 2. 改善案を生成
    proposals = generate_mutations(req.current_code, scores)

    # 3. 世界観フィルタで不適切な案を除外
    valid = filter_mutations(proposals)

    # 4. 最適案を選択
    best = select_best(valid, scores)

    if best is None:
        return EvolutionResponse(status="no-change")

    # 5. 新しいコードを生成
    new_code = generate_code(req.component, req.current_code, best)

    # 6. 差分を生成
    diff = generate_diff(req.current_code, new_code)

    # 7. 履歴に保存
    save_history(
        component=req.component,
        old_code=req.current_code,
        new_code=new_code,
        diff=diff,
        scores=scores,
        proposal=best
    )

    # 8. VFS に書き込み
    write_file(f"{req.component}.tsx", new_code)

    return EvolutionResponse(
        status="ok",
        new_code=new_code,
        diff=diff
    )
