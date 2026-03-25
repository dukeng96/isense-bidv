from fastapi import APIRouter, HTTPException, Path
from typing import List
from models import TopicMappingBase, TopicMapping, GlobalFallbackUpdate
import database as db

router = APIRouter(prefix="/mappings", tags=["Mappings"])

@router.get("/", response_model=List[TopicMapping])
def get_mappings():
    return db.get_all_mappings()

@router.post("/", response_model=TopicMapping, status_code=201)
def create_mapping(mapping: TopicMappingBase):
    if not db.get_scorecard(mapping.scorecard_id):
        raise HTTPException(status_code=400, detail="Scorecard ID does not exist")
    new_mapping = TopicMapping(**mapping.model_dump())
    return db.create_mapping(new_mapping)

@router.delete("/{topic_id}", status_code=204)
def delete_mapping(topic_id: str = Path(...)):
    if not db.delete_mapping(topic_id):
        raise HTTPException(status_code=404, detail="Mapping not found")

@router.put("/global-fallback", status_code=200)
def update_global_fallback(fallback: GlobalFallbackUpdate):
    if not db.set_global_fallback(fallback.scorecard_id):
        raise HTTPException(status_code=400, detail="Scorecard ID does not exist")
    return {"status": "success", "message": f"Global fallback set to {fallback.scorecard_id}"}
