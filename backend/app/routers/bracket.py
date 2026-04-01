from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.match import Match
from app.schemas.match import MatchOut

router = APIRouter(tags=["bracket"])

KNOCKOUT_STAGES = ["R32", "R16", "QF", "SF", "THIRD", "FINAL"]


@router.get("/bracket")
def get_bracket(db: Session = Depends(get_db)):
    """
    Returns knockout rounds keyed by stage code.
    Each stage is a list of matches ordered by match_date.
    Pre-tournament: team slots are TBD placeholders.
    """
    result: dict[str, list[dict]] = {stage: [] for stage in KNOCKOUT_STAGES}

    matches = (
        db.query(Match)
        .filter(Match.stage.in_(KNOCKOUT_STAGES))
        .order_by(Match.match_date)
        .all()
    )

    for m in matches:
        result[m.stage].append(
            {
                "id": m.id,
                "external_id": m.external_id,
                "stage": m.stage,
                "match_date": m.match_date.isoformat(),
                "home_team": m.home_team,
                "away_team": m.away_team,
                "home_score": m.home_score,
                "away_score": m.away_score,
                "status": m.status,
            }
        )

    return result
