from fastapi import APIRouter
from typing import List
from models import Criterion, GenerateScorecardRequest

router = APIRouter(prefix="/ai", tags=["AI Generate Mock"])

@router.post("/generate-scorecard", response_model=List[Criterion])
def generate_scorecard(request: GenerateScorecardRequest):
    # This is a mock response matching the criteria from 'Chỉnh sửa bộ tiêu chí chấm điểm' screenshot
    mock_criteria = [
        # General Layer
        {
            "code": "GEN_01",
            "name": "Chào hỏi đúng kịch bản",
            "layer": "general",
            "options_type": "Yes/No/NA",
            "yes_score": 10,
            "no_score": 0,
            "na_score": 10,
            "max_score": 10
        },
        {
            "code": "GEN_02",
            "name": "Thái độ chuyên nghiệp & Lịch sự",
            "layer": "general",
            "options_type": "Yes/No/NA",
            "yes_score": 20,
            "no_score": -5,
            "na_score": 0,
            "max_score": 20
        },
        # Business Specific Layer
        {
            "code": "BUS_01",
            "name": "Nếu khách hàng có từ hai người dùng",
            "layer": "business",
            "options_type": "Yes/No/NA",
            "yes_score": 15,
            "no_score": 0,
            "na_score": 15,
            "max_score": 15
        },
        {
            "code": "BUS_02",
            "name": "Nếu nguyên nhân là mất điện thoại",
            "layer": "business",
            "options_type": "Yes/No/NA",
            "yes_score": 25,
            "no_score": 0,
            "na_score": 0,
            "max_score": 25
        },
        # Audio Rules Layer
        {
            "code": "AUDIO_01",
            "name": "Hold call time (Thời gian chờ)",
            "layer": "audio_rules",
            "audio_rules_data": {
                "max_hold_time_s": 30
            }
        },
        {
            "code": "AUDIO_02",
            "name": "Speaking rate (Tốc độ nói)",
            "layer": "audio_rules",
            "audio_rules_data": {
                "ideal_speaking_rate_wpm": 120
            }
        },
        {
            "code": "AUDIO_03",
            "name": "Silence duration (Khoảng lặng)",
            "layer": "audio_rules",
            "audio_rules_data": {
                "max_silence_duration_s": 10
            }
        },
        {
            "code": "AUDIO_04",
            "name": "Overlapping (Nói chồng lấn)",
            "layer": "audio_rules",
            "audio_rules_data": {
                "overlapping_threshold_percent": 5
            }
        }
    ]
    return [Criterion(**c) for c in mock_criteria]
