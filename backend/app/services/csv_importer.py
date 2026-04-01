"""
CSV importer for Google Forms group-position prediction exports.

Expected CSV format (from Google Forms export):
  Zaman damgası,İsim Soyisim,Grup A 1.,Grup A 2.,Grup A 3.,Grup A 4.,Grup B 1.,...
  2026-05-01 10:23:45,Ahmet Yılmaz,Mexico,USA,Canada,Honduras,...

Column header patterns recognised:
  "Grup A 1."  or  "A Grubu 1."  or  "Group A 1"   → group=A, position=1
  Position value is a team name string (English or Turkish).

Import is idempotent: re-importing the same row overwrites predictions.
"""

import csv
import io
import re

from sqlalchemy.orm import Session

from app.models.group_prediction import GroupPrediction
from app.models.participant import Participant
from app.schemas.prediction import ImportResult

# Columns to skip (not group prediction columns)
SKIP_COLUMNS = {"zaman damgası", "timestamp", "isim soyisim", "isim", "name", "ad soyad"}

# Regex patterns to extract group letter and position from column header
# Matches: "Grup A 1.", "A Grubu 1.", "Group A 1", "Grup A - 1", etc.
_GROUP_COL_RE = re.compile(
    r"(?:grup\s+([a-lA-L])|([a-lA-L])\s+grubu|group\s+([a-lA-L]))"
    r"[\s\-\.]*"
    r"([1-4])",
    re.IGNORECASE,
)


def _parse_group_column(header: str) -> tuple[str, int] | None:
    """
    Returns (group_letter, position) if the header looks like a group prediction column.
    Returns None if not recognised.
    """
    m = _GROUP_COL_RE.search(header)
    if not m:
        return None
    group = (m.group(1) or m.group(2) or m.group(3) or "").upper()
    position = int(m.group(4))
    if not group or position not in (1, 2, 3, 4):
        return None
    return group, position


def import_predictions(csv_text: str, db: Session) -> ImportResult:
    reader = csv.DictReader(io.StringIO(csv_text))

    if reader.fieldnames is None:
        return ImportResult(
            participants_created=0,
            participants_updated=0,
            predictions_upserted=0,
            rows_skipped=0,
            errors=["CSV has no header row"],
        )

    # Build column → (group, position) map
    col_to_group_pos: dict[str, tuple[str, int]] = {}
    errors: list[str] = []

    for col in reader.fieldnames:
        if col.strip().lower() in SKIP_COLUMNS:
            continue
        parsed = _parse_group_column(col)
        if parsed is None:
            errors.append(f"Column '{col}' not recognised as a group prediction — skipped")
        else:
            col_to_group_pos[col] = parsed

    participants_created = 0
    participants_updated = 0
    predictions_upserted = 0
    rows_skipped = 0

    for row in reader:
        # Locate participant name
        name = None
        for name_col in ["İsim Soyisim", "Isim Soyisim", "isim soyisim", "Ad Soyad", "İsim", "Name", "name"]:
            if name_col in row and row[name_col].strip():
                name = row[name_col].strip()
                break

        if not name:
            rows_skipped += 1
            errors.append(f"Row skipped — could not find participant name: {dict(row)}")
            continue

        # Upsert participant
        participant = db.query(Participant).filter(Participant.name == name).first()
        if participant is None:
            participant = Participant(name=name)
            db.add(participant)
            db.flush()
            participants_created += 1
        else:
            participants_updated += 1

        # Collect all group predictions for this row
        # group_name → {position: team_name}
        group_data: dict[str, dict[int, str]] = {}
        for col, (group, pos) in col_to_group_pos.items():
            team = row.get(col, "").strip()
            if team:
                group_data.setdefault(group, {})[pos] = team

        # Upsert one GroupPrediction row per group
        for group, positions in group_data.items():
            existing = (
                db.query(GroupPrediction)
                .filter(
                    GroupPrediction.participant_id == participant.id,
                    GroupPrediction.group_name == group,
                )
                .first()
            )
            r1 = positions.get(1)
            r2 = positions.get(2)
            r3 = positions.get(3)
            r4 = positions.get(4)

            if existing is None:
                gp = GroupPrediction(
                    participant_id=participant.id,
                    group_name=group,
                    r1=r1, r2=r2, r3=r3, r4=r4,
                )
                db.add(gp)
            else:
                if r1 is not None: existing.r1 = r1
                if r2 is not None: existing.r2 = r2
                if r3 is not None: existing.r3 = r3
                if r4 is not None: existing.r4 = r4

            predictions_upserted += 1

    db.commit()

    return ImportResult(
        participants_created=participants_created,
        participants_updated=participants_updated,
        predictions_upserted=predictions_upserted,
        rows_skipped=rows_skipped,
        errors=errors,
    )
