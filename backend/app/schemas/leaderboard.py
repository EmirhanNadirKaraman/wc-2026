from datetime import datetime

from pydantic import BaseModel


class StandingEntry(BaseModel):
    rank: int
    participant: str
    points: int
    perfect: int
    correct_outcome: int
    predictions_made: int
    matches_scored: int


class StandingsResponse(BaseModel):
    generated_at: datetime
    standings: list[StandingEntry]


class MetaResponse(BaseModel):
    total_matches: int
    played: int
    last_sync: datetime | None
    form_url: str
