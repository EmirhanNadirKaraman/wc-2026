from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.match import Match
from app.models.sync_log import SyncLog
from app.schemas.leaderboard import MetaResponse

router = APIRouter(tags=["meta"])


@router.get("/meta", response_model=MetaResponse)
def get_meta(db: Session = Depends(get_db)):
    total_matches = db.query(func.count(Match.id)).scalar() or 0
    played = (
        db.query(func.count(Match.id))
        .filter(Match.status == "FINISHED")
        .scalar()
        or 0
    )
    last_sync_log = (
        db.query(SyncLog)
        .filter(SyncLog.status == "OK")
        .order_by(SyncLog.synced_at.desc())
        .first()
    )
    last_sync = last_sync_log.synced_at if last_sync_log else None
    return MetaResponse(
        total_matches=total_matches,
        played=played,
        last_sync=last_sync,
        form_url=settings.form_url,
    )
