from datetime import datetime

from pydantic import BaseModel


class GroupPredictionOut(BaseModel):
    group_name: str
    r1: str | None
    r2: str | None
    r3: str | None
    r4: str | None

    model_config = {"from_attributes": True}


class ParticipantPredictionSummary(BaseModel):
    name: str
    predictions_made: int  # number of groups predicted
    points: int
    perfect: int
    correct_outcome: int  # correct_leaders


class ParticipantFullPredictions(BaseModel):
    name: str
    groups: list[GroupPredictionOut]


class ImportResult(BaseModel):
    participants_created: int
    participants_updated: int
    predictions_upserted: int
    rows_skipped: int
    errors: list[str]


class SyncResult(BaseModel):
    matches_updated: int
    status: str
    error_msg: str | None = None
    synced_at: datetime
