from datetime import datetime
from typing import Literal

from pydantic import BaseModel

Stage = Literal["GROUP", "R32", "R16", "QF", "SF", "THIRD", "FINAL"]
Status = Literal["SCHEDULED", "LIVE", "FINISHED", "POSTPONED"]


class MatchOut(BaseModel):
    id: int
    external_id: str
    stage: str
    group_name: str | None
    match_date: datetime
    home_team: str
    away_team: str
    home_score: int | None
    away_score: int | None
    status: str
    matchday: int | None
    slot_label: str | None = None

    model_config = {"from_attributes": True}
