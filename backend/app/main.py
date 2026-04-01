from contextlib import asynccontextmanager
from datetime import datetime

from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, SessionLocal, engine

# WC 2026 dates (UTC)
WC_START = datetime(2026, 6, 11)
WC_END = datetime(2026, 7, 19)


def _sync_job():
    from app.services.sync import run_sync
    db = SessionLocal()
    try:
        run_sync(db)
    finally:
        db.close()


def _get_sync_interval_minutes() -> int:
    now = datetime.utcnow()
    if WC_START <= now <= WC_END:
        return 5
    elif now > WC_END:
        return 1440  # once daily post-tournament
    else:
        return 360  # every 6 hours pre-tournament


scheduler = BackgroundScheduler()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables (idempotent — Alembic handles migrations in prod)
    Base.metadata.create_all(bind=engine)

    interval = _get_sync_interval_minutes()
    scheduler.add_job(
        _sync_job,
        "interval",
        minutes=interval,
        id="score_sync",
        replace_existing=True,
    )
    scheduler.start()
    yield
    scheduler.shutdown(wait=False)


app = FastAPI(title="WC 2026 Prediction League API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:5173"],
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["*"],
)

# Register routers
from app.routers import admin, bracket, groups, home, matches, meta, predictions, standings  # noqa: E402

app.include_router(home.router)
app.include_router(standings.router)
app.include_router(matches.router)
app.include_router(groups.router)
app.include_router(bracket.router)
app.include_router(predictions.router)
app.include_router(meta.router)
app.include_router(admin.router)


@app.get("/")
def health():
    return {"status": "ok", "version": "1.0.0"}
