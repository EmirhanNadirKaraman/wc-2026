from datetime import datetime

from sqlalchemy import DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base

STAGES = ("GROUP", "R32", "R16", "QF", "SF", "THIRD", "FINAL")
STATUSES = ("SCHEDULED", "LIVE", "FINISHED", "POSTPONED")


class Match(Base):
    __tablename__ = "matches"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    stage: Mapped[str] = mapped_column(String, nullable=False)  # one of STAGES
    group_name: Mapped[str | None] = mapped_column(String, nullable=True)  # A-P or None
    match_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    home_team: Mapped[str] = mapped_column(String, nullable=False)
    away_team: Mapped[str] = mapped_column(String, nullable=False)
    home_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    away_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    status: Mapped[str] = mapped_column(String, nullable=False, default="SCHEDULED")
    matchday: Mapped[int | None] = mapped_column(Integer, nullable=True)
    slot_label: Mapped[str | None] = mapped_column(String, nullable=True)  # e.g. "1A vs 2B"
    last_synced_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

