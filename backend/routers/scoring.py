from fastapi import APIRouter, HTTPException, Query
from models import Scorecard
from typing import Optional
import database as db

router = APIRouter(prefix="/scoring", tags=["Scoring Logic"])

@router.get("/scorecard", response_model=Scorecard)
def get_scorecard_for_topic(topic_name: str = Query(..., description="The name of the topic to resolve scorecard for")):
    # 1. Try to find mapping by topic mapping
    mapping = db.get_mapping_by_topic_name(topic_name)
    if mapping:
        sc = db.get_scorecard(mapping.scorecard_id)
        if sc:
            return sc
    
    # 2. If not found or mapping has invalid scorecard, fallback to global fallback
    sc_fallback = db.get_global_fallback_scorecard()
    if sc_fallback:
        return sc_fallback
        
    raise HTTPException(status_code=404, detail="No specific scorecard mapped and no fallback configured")
