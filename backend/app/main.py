from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import github

app = FastAPI(
    title=settings.APP_NAME,
    description="GitHub Activity Analytics API powering DevPulse",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ─────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────
app.include_router(github.router, prefix="/api/v1/github", tags=["GitHub"])


@app.get("/health", tags=["Meta"])
async def health_check():
    return {"status": "ok", "service": settings.APP_NAME}
