"""
GET /home — Returns everything the homepage dashboard needs in one request:
- featuredMatch: live match, or Turkey match, or next upcoming match
- todayMatches: all matches today (UTC)
- turkeyNextMatch: Turkey's next unplayed match
"""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.match import Match
from app.schemas.match import MatchOut

router = APIRouter(tags=["home"])

TURKEY_NAMES = {"Turkey", "Türkiye"}


def _match_to_dict(m: Match) -> dict:
    return {
        "id": m.id,
        "external_id": m.external_id,
        "stage": m.stage,
        "group_name": m.group_name,
        "match_date": m.match_date.isoformat(),
        "home_team": m.home_team,
        "away_team": m.away_team,
        "home_score": m.home_score,
        "away_score": m.away_score,
        "status": m.status,
        "matchday": m.matchday,
        "is_live": m.status == "LIVE",
        "is_turkey_match": m.home_team in TURKEY_NAMES or m.away_team in TURKEY_NAMES,
    }


@router.get("/home")
def get_home(db: Session = Depends(get_db)):
    now_utc = datetime.now(timezone.utc).replace(tzinfo=None)
    today_start = now_utc.replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = now_utc.replace(hour=23, minute=59, second=59, microsecond=999999)

    all_matches = db.query(Match).order_by(Match.match_date).all()

    # Today's matches
    today_matches = [
        m for m in all_matches
        if today_start <= m.match_date <= today_end
    ]

    # Featured match priority: live → Turkey live → Turkey upcoming → next upcoming
    featured = None
    live_matches = [m for m in all_matches if m.status == "LIVE"]
    turkey_live = [m for m in live_matches if m.home_team in TURKEY_NAMES or m.away_team in TURKEY_NAMES]

    if turkey_live:
        featured = turkey_live[0]
    elif live_matches:
        featured = live_matches[0]
    else:
        # Find the next upcoming Turkey match
        turkey_upcoming = [
            m for m in all_matches
            if m.status == "SCHEDULED"
            and (m.home_team in TURKEY_NAMES or m.away_team in TURKEY_NAMES)
            and m.match_date >= now_utc
        ]
        if turkey_upcoming:
            featured = turkey_upcoming[0]
        else:
            # Fall back to next upcoming match
            upcoming = [m for m in all_matches if m.status == "SCHEDULED" and m.match_date >= now_utc]
            featured = upcoming[0] if upcoming else None

    # Turkey's next unplayed match
    turkey_next = None
    for m in all_matches:
        if m.status == "SCHEDULED" and (m.home_team in TURKEY_NAMES or m.away_team in TURKEY_NAMES):
            if m.match_date >= now_utc:
                turkey_next = m
                break

    return {
        "featured_match": _match_to_dict(featured) if featured else None,
        "today_matches": [_match_to_dict(m) for m in today_matches],
        "turkey_next_match": _match_to_dict(turkey_next) if turkey_next else None,
    }
