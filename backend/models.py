from typing import List, Optional, Dict
from pydantic import BaseModel, Field, conint, field_validator
from enum import Enum

class LayerType(str, Enum):
    general = "general"
    business = "business"
    audio_rules = "audio_rules"

class AnswerOptionType(str, Enum):
    yes_no_na = "Yes/No/NA"
    yes_no = "Yes/No"

class AudioRuleCriterionData(BaseModel):
    max_hold_time_s: Optional[int] = Field(None, description="Max hold call time in seconds")
    ideal_speaking_rate_wpm: Optional[int] = Field(None, description="Ideal speaking rate in WPM")
    max_silence_duration_s: Optional[int] = Field(None, description="Max silence duration in seconds")
    overlapping_threshold_percent: Optional[int] = Field(None, ge=0, le=100, description="Overlapping threshold (%)")

class Criterion(BaseModel):
    code: str = Field(..., example="GEN_01")
    name: str = Field(..., example="Chào hỏi đúng kịch bản")
    layer: LayerType = Field(..., example="general")
    options_type: Optional[AnswerOptionType] = Field(None, example="Yes/No/NA")
    yes_score: Optional[int] = Field(None)
    no_score: Optional[int] = Field(None)
    na_score: Optional[int] = Field(None)
    max_score: Optional[int] = Field(None)

    # For audio rules which have different structure:
    audio_rules_data: Optional[AudioRuleCriterionData] = None

class ScorecardCreate(BaseModel):
    name: str = Field(..., example="Tiêu chuẩn CSKH 2024")
    description: Optional[str] = Field(None, example="Bộ tiêu chí chung...")
    status: str = Field("Đang hoạt động", example="Đang hoạt động")
    threshold: Optional[int] = Field(None, ge=0, le=100, example=85)
    is_global_fallback: bool = False
    criteria: List[Criterion] = []

class Scorecard(ScorecardCreate):
    id: str = Field(..., example="SC-001")

class TopicMappingBase(BaseModel):
    topic_id: str = Field(..., example="T-102")
    topic_name: str = Field(..., example="Khóa SmartKids")
    scorecard_id: str = Field(..., example="SC-001")

class TopicMapping(TopicMappingBase):
    pass

class GlobalFallbackUpdate(BaseModel):
    scorecard_id: str

class GenerateScorecardRequest(BaseModel):
    goal: Optional[str] = None
    raw_text: str = Field(..., min_length=10, description="Quy trình nghiệp vụ để AI sinh ra tiêu chí")
