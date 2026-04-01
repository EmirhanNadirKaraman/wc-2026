from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.match import Match
from app.schemas.match import MatchOut

router = APIRouter(tags=["matches"])


@router.get("/matches", response_model=list[MatchOut])
def list_matches(
    stage: str | None = Query(None),
    group: str | None = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Match)
    if stage:
        q = q.filter(Match.stage == stage.upper())
    if group:
        q = q.filter(Match.group_name == group.upper())
    matches = q.order_by(Match.match_date).all()
    return matches


@router.get("/matches/{match_id}", response_model=MatchOut)
def get_match(match_id: int, db: Session = Depends(get_db)):
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    return match
