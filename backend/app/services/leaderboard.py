"""
Aggregates group predictions + actual group standings into a ranked leaderboard.
Points are always computed at query time — never stored.
"""

from sqlalchemy.orm import Session

from app.models.participant import Participant
from app.routers.groups import _compute_groups_from_matches
from app.schemas.leaderboard import StandingEntry
from app.services.scoring import score_group_prediction


def _group_standings_to_position_map(group_data: dict) -> dict[str, dict[int, str]]:
    """
    Convert the groups dict {group_letter: [{"team": ..., ...}, ...]}
    into {group_letter: {1: team_name, 2: team_name, 3: team_name, 4: team_name}}.
    Teams are already sorted by points in _compute_groups_from_matches.
    """
    result: dict[str, dict[int, str]] = {}
    for group_letter, teams in group_data.items():
        result[group_letter] = {i + 1: t["team"] for i, t in enumerate(teams)}
    return result


def build_standings(db: Session) -> list[StandingEntry]:
    participants = db.query(Participant).order_by(Participant.name).all()

    # Compute actual group standings once for all participants
    group_data = _compute_groups_from_matches(db)
    actual_positions = _group_standings_to_position_map(group_data)

    entries: list[StandingEntry] = []

    for participant in participants:
        total_points = 0
        perfect = 0        # groups where all 4 positions correct
        correct_leaders = 0  # groups where 1st place correct
        predictions_made = len(participant.group_predictions)
        groups_scored = 0

        for gp in participant.group_predictions:
            actual = actual_positions.get(gp.group_name, {})

            # Only score if the group has at least its top 2 decided
            if len(actual) < 2:
                continue

            predicted = {
                1: gp.r1,
                2: gp.r2,
                3: gp.r3,
                4: gp.r4,
            }

            result = score_group_prediction(predicted, actual)
            total_points += result.points
            if result.is_perfect:
                perfect += 1
            if result.is_correct_leader:
                correct_leaders += 1
            groups_scored += 1

        entries.append(
            StandingEntry(
                rank=0,
                participant=participant.name,
                points=total_points,
                perfect=perfect,
                correct_outcome=correct_leaders,
                predictions_made=predictions_made,
                matches_scored=groups_scored,
            )
        )

    # Sort: points desc, perfect desc, correct_leaders desc, name asc
    entries.sort(
        key=lambda e: (-e.points, -e.perfect, -e.correct_outcome, e.participant)
    )

    # Assign ranks (ties share the same rank)
    for i, entry in enumerate(entries):
        if i == 0:
            entry.rank = 1
        else:
            prev = entries[i - 1]
            if entry.points == prev.points and entry.perfect == prev.perfect:
                entry.rank = prev.rank
            else:
                entry.rank = i + 1

    return entries
