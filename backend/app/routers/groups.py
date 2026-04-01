"""
Returns group stage standings derived from match results in the DB.
Falls back to the football API live data if available.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.match import Match

router = APIRouter(tags=["groups"])


def _compute_groups_from_matches(db: Session) -> dict:
    """
    Build group tables from finished GROUP stage matches in the DB.
    Returns dict: { "A": [{"team": ..., "played": ..., ...}], ... }
    """
    group_matches = (
        db.query(Match)
        .filter(Match.stage == "GROUP")
        .order_by(Match.match_date)
        .all()
    )

    # Accumulate team stats
    # stats[group][team] = {played, won, drawn, lost, gf, ga, pts}
    stats: dict[str, dict[str, dict]] = {}

    for m in group_matches:
        g = m.group_name or "?"
        if g not in stats:
            stats[g] = {}

        for team in [m.home_team, m.away_team]:
            if team not in stats[g]:
                stats[g][team] = {
                    "team": team,
                    "played": 0,
                    "won": 0,
                    "drawn": 0,
                    "lost": 0,
                    "goals_for": 0,
                    "goals_against": 0,
                    "goal_difference": 0,
                    "points": 0,
                }

        if m.home_score is None or m.away_score is None:
            continue  # unplayed

        hs, as_ = m.home_score, m.away_score
        h, a = stats[g][m.home_team], stats[g][m.away_team]

        h["played"] += 1
        a["played"] += 1
        h["goals_for"] += hs
        h["goals_against"] += as_
        a["goals_for"] += as_
        a["goals_against"] += hs

        if hs > as_:
            h["won"] += 1
            h["points"] += 3
            a["lost"] += 1
        elif as_ > hs:
            a["won"] += 1
            a["points"] += 3
            h["lost"] += 1
        else:
            h["drawn"] += 1
            h["points"] += 1
            a["drawn"] += 1
            a["points"] += 1

    # Compute goal difference and sort
    result = {}
    for group, teams in sorted(stats.items()):
        for t in teams.values():
            t["goal_difference"] = t["goals_for"] - t["goals_against"]
        sorted_teams = sorted(
            teams.values(),
            key=lambda t: (-t["points"], -t["goal_difference"], -t["goals_for"], t["team"]),
        )
        result[group] = sorted_teams

    return result


@router.get("/groups")
def get_groups(db: Session = Depends(get_db)):
    groups = _compute_groups_from_matches(db)
    return groups
