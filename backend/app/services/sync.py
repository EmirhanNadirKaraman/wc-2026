"""
Orchestrates score sync: fetch from football-data.org → diff → upsert → log.
"""

from datetime import datetime

from sqlalchemy.orm import Session

from app.models.match import Match
from app.models.sync_log import SyncLog
from app.services import football_api


def run_sync(db: Session) -> dict:
    """
    Fetch all matches from the football API and upsert into the DB.
    Returns a dict with status info.
    """
    matches_updated = 0
    try:
        api_matches = football_api.fetch_all_matches()
    except Exception as exc:
        log = SyncLog(
            matches_updated=0,
            status="ERROR",
            error_msg=str(exc),
        )
        db.add(log)
        db.commit()
        return {"matches_updated": 0, "status": "ERROR", "error_msg": str(exc)}

    now = datetime.utcnow()

    for m in api_matches:
        existing = db.query(Match).filter(Match.external_id == m["external_id"]).first()

        if existing is None:
            # New match — insert
            new_match = Match(
                external_id=m["external_id"],
                stage=m["stage"],
                group_name=m["group_name"],
                match_date=m["match_date"],
                home_team=m["home_team"],
                away_team=m["away_team"],
                home_score=m["home_score"],
                away_score=m["away_score"],
                status=m["status"],
                matchday=m["matchday"],
                last_synced_at=now,
            )
            db.add(new_match)
            matches_updated += 1
        else:
            # Update only changed fields
            changed = False

            # Only update scores when both are not None (match actually played)
            if m["home_score"] is not None and m["away_score"] is not None:
                if existing.home_score != m["home_score"] or existing.away_score != m["away_score"]:
                    existing.home_score = m["home_score"]
                    existing.away_score = m["away_score"]
                    changed = True

            if existing.status != m["status"]:
                existing.status = m["status"]
                changed = True

            # Update team names in case TBD slots got filled
            if existing.home_team != m["home_team"] and m["home_team"] != "TBD":
                existing.home_team = m["home_team"]
                changed = True
            if existing.away_team != m["away_team"] and m["away_team"] != "TBD":
                existing.away_team = m["away_team"]
                changed = True

            if changed:
                existing.last_synced_at = now
                matches_updated += 1

    log = SyncLog(
        matches_updated=matches_updated,
        status="OK",
        error_msg=None,
    )
    db.add(log)
    db.commit()

    return {
        "matches_updated": matches_updated,
        "status": "OK",
        "error_msg": None,
        "synced_at": now,
    }
