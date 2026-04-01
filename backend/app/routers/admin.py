from datetime import datetime

from fastapi import APIRouter, Depends, Header, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.sync_log import SyncLog
from app.schemas.prediction import ImportResult, SyncResult
from app.services import csv_importer, sync

router = APIRouter(prefix="/admin", tags=["admin"])


def verify_admin(x_admin_password: str = Header(...)):
    if x_admin_password != settings.admin_password:
        raise HTTPException(status_code=401, detail="Invalid admin password")


@router.post("/sync", response_model=SyncResult, dependencies=[Depends(verify_admin)])
def trigger_sync(db: Session = Depends(get_db)):
    result = sync.run_sync(db)
    return SyncResult(
        matches_updated=result["matches_updated"],
        status=result["status"],
        error_msg=result.get("error_msg"),
        synced_at=result.get("synced_at", datetime.utcnow()),
    )


@router.post("/import-csv", response_model=ImportResult, dependencies=[Depends(verify_admin)])
async def import_csv(file: UploadFile, db: Session = Depends(get_db)):
    content = await file.read()
    try:
        text = content.decode("utf-8-sig")  # handle BOM from Excel exports
    except UnicodeDecodeError:
        text = content.decode("latin-1")
    result = csv_importer.import_predictions(text, db)
    return result


@router.delete(
    "/participants/{name}", dependencies=[Depends(verify_admin)]
)
def delete_participant(name: str, db: Session = Depends(get_db)):
    from app.models.participant import Participant

    participant = db.query(Participant).filter(Participant.name == name).first()
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    db.delete(participant)
    db.commit()
    return {"deleted": name}


@router.get("/sync-log", dependencies=[Depends(verify_admin)])
def get_sync_log(limit: int = 20, db: Session = Depends(get_db)):
    logs = (
        db.query(SyncLog)
        .order_by(SyncLog.synced_at.desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "id": l.id,
            "synced_at": l.synced_at,
            "matches_updated": l.matches_updated,
            "status": l.status,
            "error_msg": l.error_msg,
        }
        for l in logs
    ]
