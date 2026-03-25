from fastapi import APIRouter, HTTPException, Path
from typing import List
import uuid
from models import Scorecard, ScorecardCreate
import database as db

router = APIRouter(prefix="/scorecards", tags=["Scorecards"])

@router.get("/", response_model=List[Scorecard])
def get_scorecards():
    return db.get_all_scorecards()

@router.get("/{sc_id}", response_model=Scorecard)
def get_scorecard(sc_id: str = Path(..., title="The ID of the scorecard to get")):
    sc = db.get_scorecard(sc_id)
    if not sc:
        raise HTTPException(status_code=404, detail="Scorecard not found")
    return sc

@router.post("/", response_model=Scorecard, status_code=201)
def create_scorecard(sc_in: ScorecardCreate):
    sc_id = "SC-" + str(uuid.uuid4())[:8].upper()
    sc = Scorecard(id=sc_id, **sc_in.model_dump())
    return db.create_scorecard(sc)

@router.put("/{sc_id}", response_model=Scorecard)
def update_scorecard(sc_in: ScorecardCreate, sc_id: str = Path(...)):
    if not db.get_scorecard(sc_id):
        raise HTTPException(status_code=404, detail="Scorecard not found")
    sc = Scorecard(id=sc_id, **sc_in.model_dump())
    db.update_scorecard(sc_id, sc)
    return sc

@router.delete("/{sc_id}", status_code=204)
def delete_scorecard(sc_id: str = Path(...)):
    if not db.delete_scorecard(sc_id):
        raise HTTPException(status_code=404, detail="Scorecard not found")
