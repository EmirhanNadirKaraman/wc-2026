from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.group_prediction import GroupPrediction
from app.models.participant import Participant
from app.schemas.prediction import (
    GroupPredictionOut,
    ParticipantFullPredictions,
    ParticipantPredictionSummary,
)
from app.routers.groups import _compute_groups_from_matches
from app.services.scoring import score_group_prediction

router = APIRouter(tags=["predictions"])


def _build_actual_positions(db: Session) -> dict[str, dict[int, str]]:
    group_data = _compute_groups_from_matches(db)
    return {g: {i + 1: t["team"] for i, t in enumerate(teams)} for g, teams in group_data.items()}


@router.get("/predictions", response_model=list[ParticipantPredictionSummary])
def list_participants(db: Session = Depends(get_db)):
    """List all participants with their current score summary."""
    participants = db.query(Participant).order_by(Participant.name).all()
    actual_positions = _build_actual_positions(db)

    result = []
    for p in participants:
        points = 0
        perfect = 0
        correct_leaders = 0
        for gp in p.group_predictions:
            actual = actual_positions.get(gp.group_name, {})
            if len(actual) < 2:
                continue
            r = score_group_prediction(
                {1: gp.r1, 2: gp.r2, 3: gp.r3, 4: gp.r4}, actual
            )
            points += r.points
            if r.is_perfect:
                perfect += 1
            if r.is_correct_leader:
                correct_leaders += 1

        result.append(
            ParticipantPredictionSummary(
                name=p.name,
                predictions_made=len(p.group_predictions),
                points=points,
                perfect=perfect,
                correct_outcome=correct_leaders,
            )
        )
    return result


@router.get("/predictions/{participant_name}", response_model=ParticipantFullPredictions)
def get_participant_predictions(participant_name: str, db: Session = Depends(get_db)):
    """Get all group predictions for a single participant."""
    participant = db.query(Participant).filter(Participant.name == participant_name).first()
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")

    groups = sorted(participant.group_predictions, key=lambda gp: gp.group_name)
    return ParticipantFullPredictions(
        name=participant.name,
        groups=[GroupPredictionOut.model_validate(gp) for gp in groups],
    )
