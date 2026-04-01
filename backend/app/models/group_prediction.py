from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class GroupPrediction(Base):
    """Stores a participant's predicted finish order for a single group (r1=1st, r2=2nd, etc.)."""

    __tablename__ = "group_predictions"
    __table_args__ = (UniqueConstraint("participant_id", "group_name"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    participant_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("participants.id"), nullable=False
    )
    group_name: Mapped[str] = mapped_column(String, nullable=False)  # e.g. "A" through "L"
    r1: Mapped[str | None] = mapped_column(String, nullable=True)  # predicted 1st place
    r2: Mapped[str | None] = mapped_column(String, nullable=True)  # predicted 2nd place
    r3: Mapped[str | None] = mapped_column(String, nullable=True)  # predicted 3rd place
    r4: Mapped[str | None] = mapped_column(String, nullable=True)  # predicted 4th place
    imported_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    participant: Mapped["Participant"] = relationship(  # noqa: F821
        "Participant", back_populates="group_predictions"
    )
