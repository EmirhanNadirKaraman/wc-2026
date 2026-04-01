from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Prediction(Base):
    __tablename__ = "predictions"
    __table_args__ = (UniqueConstraint("participant_id", "match_id"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    participant_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("participants.id"), nullable=False
    )
    match_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("matches.id"), nullable=False
    )
    predicted_home: Mapped[int] = mapped_column(Integer, nullable=False)
    predicted_away: Mapped[int] = mapped_column(Integer, nullable=False)
    imported_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    participant: Mapped["Participant"] = relationship(  # noqa: F821
        "Participant", back_populates="predictions"
    )
    match: Mapped["Match"] = relationship("Match", back_populates="predictions")  # noqa: F821
