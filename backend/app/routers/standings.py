from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.leaderboard import StandingsResponse
from app.services.leaderboard import build_standings

router = APIRouter(tags=["standings"])


@router.get("/standings", response_model=StandingsResponse)
def get_standings(db: Session = Depends(get_db)):
    standings = build_standings(db)
    return StandingsResponse(generated_at=datetime.utcnow(), standings=standings)
