"""
Scoring rules for WC 2026 group-position prediction league.

Each participant predicts the final finish order (1st–4th) for every group.
Scoring is based on how accurately those predictions match the actual standings.

To change point values, only edit the constants below.
"""

from dataclasses import dataclass, field

# Points awarded per correctly predicted position
POINTS_FOR_POSITION = {
    1: 3,  # correct group leader (1st place) — also counts as Doğru Lider
    2: 2,  # correct 2nd place
    3: 1,  # correct 3rd place
    4: 1,  # correct 4th place
}


@dataclass
class GroupScoringResult:
    points: int = 0
    is_perfect: bool = False       # all 4 positions predicted correctly (Kusursuz)
    is_correct_leader: bool = False  # 1st place predicted correctly (Doğru Lider)
    correct_positions: list[int] = field(default_factory=list)  # which positions were correct


def score_group_prediction(
    predicted: dict[int, str | None],  # {1: team, 2: team, 3: team, 4: team}
    actual: dict[int, str | None],     # {1: team, 2: team, 3: team, 4: team}
) -> GroupScoringResult:
    """
    Score a participant's group prediction against the actual final standings.

    Both dicts are keyed 1–4 (position) → team name string.
    None or missing entries = unknown/unplayed, no points awarded for that position.
    """
    points = 0
    correct_positions: list[int] = []

    for pos in range(1, 5):
        pred_team = predicted.get(pos)
        actual_team = actual.get(pos)

        if not pred_team or not actual_team:
            continue  # group not finished or no prediction

        if pred_team.strip().lower() == actual_team.strip().lower():
            points += POINTS_FOR_POSITION.get(pos, 0)
            correct_positions.append(pos)

    is_perfect = set(correct_positions) == {1, 2, 3, 4}
    is_correct_leader = 1 in correct_positions

    return GroupScoringResult(
        points=points,
        is_perfect=is_perfect,
        is_correct_leader=is_correct_leader,
        correct_positions=correct_positions,
    )
