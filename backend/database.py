import uuid
from typing import List, Dict, Optional
from models import Scorecard, TopicMapping

# In-memory database
db_scorecards: Dict[str, Scorecard] = {}
db_mappings: Dict[str, TopicMapping] = {}

def get_all_scorecards() -> List[Scorecard]:
    return list(db_scorecards.values())

def get_scorecard(sc_id: str) -> Optional[Scorecard]:
    return db_scorecards.get(sc_id)

def create_scorecard(scorecard: Scorecard) -> Scorecard:
    db_scorecards[scorecard.id] = scorecard
    return scorecard

def update_scorecard(sc_id: str, scorecard: Scorecard) -> Optional[Scorecard]:
    if sc_id in db_scorecards:
        db_scorecards[sc_id] = scorecard
        return scorecard
    return None

def delete_scorecard(sc_id: str) -> bool:
    if sc_id in db_scorecards:
        del db_scorecards[sc_id]
        return True
    return False

def get_all_mappings() -> List[TopicMapping]:
    return list(db_mappings.values())

def create_mapping(mapping: TopicMapping) -> TopicMapping:
    db_mappings[mapping.topic_id] = mapping
    return mapping

def delete_mapping(topic_id: str) -> bool:
    if topic_id in db_mappings:
        del db_mappings[topic_id]
        return True
    return False

def get_mapping_by_topic_name(topic_name: str) -> Optional[TopicMapping]:
    for mapping in db_mappings.values():
        if mapping.topic_name.lower() == topic_name.lower():
            return mapping
    return None

def get_global_fallback_scorecard() -> Optional[Scorecard]:
    for sc in db_scorecards.values():
        if sc.is_global_fallback:
            return sc
    return None

def set_global_fallback(sc_id: str) -> bool:
    if sc_id not in db_scorecards:
        return False
    for sc in db_scorecards.values():
        sc.is_global_fallback = (sc.id == sc_id)
    return True
