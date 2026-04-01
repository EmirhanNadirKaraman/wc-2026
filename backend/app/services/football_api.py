"""
Client for football-data.org v4 API.
Free tier: 10 requests/minute.
WC 2026 competition code: WC
"""

from datetime import datetime

import httpx

from app.config import settings

BASE_URL = "https://api.football-data.org/v4"
COMPETITION = "WC"

# Map football-data.org round names to our stage codes
ROUND_TO_STAGE: dict[str, str] = {
    "Group Stage": "GROUP",
    "Round of 32": "R32",
    "Round of 16": "R16",
    "Quarter-finals": "QF",
    "Semi-finals": "SF",
    "Third-Place Match": "THIRD",
    "Final": "FINAL",
}

# Map football-data.org match status to ours
STATUS_MAP: dict[str, str] = {
    "SCHEDULED": "SCHEDULED",
    "TIMED": "SCHEDULED",
    "IN_PLAY": "LIVE",
    "PAUSED": "LIVE",
    "FINISHED": "FINISHED",
    "POSTPONED": "POSTPONED",
    "SUSPENDED": "POSTPONED",
    "CANCELLED": "POSTPONED",
}


def _headers() -> dict[str, str]:
    return {"X-Auth-Token": settings.football_api_key}


def _parse_match(raw: dict) -> dict:
    """Convert a raw API match object to our internal dict format."""
    stage_raw = raw.get("stage", "") or raw.get("group", "") or ""
    # Try round name first, fall back to stage field
    round_name = (raw.get("season", {}) or {}).get("currentMatchday", "")
    # football-data uses 'GROUP_STAGE' or explicit round names
    stage_code = ROUND_TO_STAGE.get(stage_raw, None)
    if stage_code is None:
        # Fallback parsing for variations
        upper = stage_raw.upper()
        if "GROUP" in upper:
            stage_code = "GROUP"
        elif "32" in upper:
            stage_code = "R32"
        elif "16" in upper:
            stage_code = "R16"
        elif "QUARTER" in upper:
            stage_code = "QF"
        elif "SEMI" in upper:
            stage_code = "SF"
        elif "THIRD" in upper or "3RD" in upper:
            stage_code = "THIRD"
        elif "FINAL" in upper:
            stage_code = "FINAL"
        else:
            stage_code = "GROUP"

    group_name = raw.get("group")
    # football-data returns "Group A" etc.
    if group_name and group_name.startswith("Group "):
        group_name = group_name.replace("Group ", "")

    home_team = (raw.get("homeTeam") or {}).get("name", "TBD")
    away_team = (raw.get("awayTeam") or {}).get("name", "TBD")

    score = raw.get("score", {}) or {}
    full_time = score.get("fullTime") or {}
    home_score = full_time.get("home")
    away_score = full_time.get("away")

    raw_status = raw.get("status", "SCHEDULED")
    status = STATUS_MAP.get(raw_status, "SCHEDULED")

    match_date_str = raw.get("utcDate", "")
    try:
        match_date = datetime.fromisoformat(match_date_str.replace("Z", "+00:00"))
    except (ValueError, AttributeError):
        match_date = datetime.utcnow()

    matchday = raw.get("matchday")

    return {
        "external_id": str(raw["id"]),
        "stage": stage_code,
        "group_name": group_name,
        "match_date": match_date,
        "home_team": home_team,
        "away_team": away_team,
        "home_score": home_score,
        "away_score": away_score,
        "status": status,
        "matchday": matchday,
    }


def fetch_all_matches() -> list[dict]:
    """Fetch all WC 2026 matches from football-data.org."""
    with httpx.Client(timeout=30) as client:
        resp = client.get(
            f"{BASE_URL}/competitions/{COMPETITION}/matches",
            headers=_headers(),
        )
        resp.raise_for_status()
        data = resp.json()

    return [_parse_match(m) for m in data.get("matches", [])]


def fetch_group_standings() -> dict:
    """
    Fetch group stage standings.
    Returns dict keyed by group letter, each value a list of team dicts.
    """
    with httpx.Client(timeout=30) as client:
        resp = client.get(
            f"{BASE_URL}/competitions/{COMPETITION}/standings",
            headers=_headers(),
        )
        resp.raise_for_status()
        data = resp.json()

    result: dict[str, list[dict]] = {}
    for standing in data.get("standings", []):
        group_raw = standing.get("group", "")
        group_letter = group_raw.replace("GROUP_", "") if group_raw else standing.get("type", "TOTAL")
        table = standing.get("table", [])
        result[group_letter] = [
            {
                "team": (entry.get("team") or {}).get("name", ""),
                "played": entry.get("playedGames", 0),
                "won": entry.get("won", 0),
                "drawn": entry.get("draw", 0),
                "lost": entry.get("lost", 0),
                "goals_for": entry.get("goalsFor", 0),
                "goals_against": entry.get("goalsAgainst", 0),
                "goal_difference": entry.get("goalDifference", 0),
                "points": entry.get("points", 0),
                "position": entry.get("position", 0),
            }
            for entry in table
        ]
    return result
