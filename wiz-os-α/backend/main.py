from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.evolve_ui import router as evolve_router
from routes.rollback_ui import router as rollback_router
from routes.evaluate_ui import router as evaluate_router
from routes.history import router as history_router
from routes.components import router as components_router
from routes.state import router as state_router

app = FastAPI(
    title="Wiz OS Backend",
    description="Self-evolving UI engine for Wiz",
    version="1.0.0"
)

# CORS（必要に応じて調整）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ルート登録
app.include_router(evolve_router, prefix="/api")
app.include_router(rollback_router, prefix="/api")
app.include_router(evaluate_router, prefix="/api")
app.include_router(history_router, prefix="/api")
app.include_router(components_router, prefix="/api")
app.include_router(state_router, prefix="/api")

@app.get("/")
def root():
    return {"status": "Wiz OS backend running"}
