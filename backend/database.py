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

from models import Criterion, AudioRuleCriterionData

# Fallback Scorecard logic
fallback_sc = Scorecard(
    id="SC-FALLBACK",
    name="Bộ tiêu chí Mặc định (Fallback)",
    description="Sử dụng làm mặc định khi Topic không được cấu hình scorecard.",
    status="Đang hoạt động",
    threshold=80,
    is_global_fallback=True,
    criteria=[
        # Layer 1
        Criterion(
            code="GEN_1.1",
            name="Tư vấn viên có chào hỏi khách hàng và giới thiệu tên ngân hàng cùng tên của mình không?",
            layer="general",
            options_type="Yes/No/NA",
            yes_score=5, no_score=0, na_score=0, max_score=5
        ),
        Criterion(
            code="GEN_1.2",
            name="Tư vấn viên có hỏi thăm sức khỏe và tình hình của khách hàng một cách lịch sự không?",
            layer="general",
            options_type="Yes/No/NA",
            yes_score=3, no_score=0, na_score=0, max_score=3
        ),
        Criterion(
            code="GEN_5.1",
            name="Tư vấn viên có trả lời đầy đủ các câu hỏi của khách hàng một cách chính xác không?",
            layer="general",
            options_type="Yes/No/NA",
            yes_score=10, no_score=-5, na_score=0, max_score=10
        ),
        Criterion(
            code="GEN_5.2",
            name="Tư vấn viên có thái độ kiên nhẫn khi khách hàng có nhiều thắc mắc không?",
            layer="general",
            options_type="Yes/No/NA",
            yes_score=7, no_score=-3, na_score=0, max_score=7
        ),
        Criterion(
            code="GEN_7.1",
            name="Tư vấn viên có tóm tắt lại các thông tin quan trọng đã trao đổi không?",
            layer="general",
            options_type="Yes/No/NA",
            yes_score=6, no_score=0, na_score=0, max_score=6
        ),
        Criterion(
            code="GEN_7.2",
            name="Tư vấn viên có cảm ơn khách hàng và chào tạm biệt một cách lịch sự không?",
            layer="general",
            options_type="Yes/No/NA",
            yes_score=3, no_score=0, na_score=0, max_score=3
        ),
        
        # Layer 2
        Criterion(
            code="BUS_2.1",
            name="Tư vấn viên có xác nhận lại yêu cầu/vấn đề của khách hàng để bảo đảm hiểu đúng trước khi xử lý không?",
            layer="business",
            options_type="Yes/No/NA",
            yes_score=8, no_score=-2, na_score=0, max_score=8
        ),
        Criterion(
            code="BUS_2.2",
            name="Tư vấn viên có hỏi thêm thông tin cần thiết để hiểu rõ hơn về tình huống của khách hàng không?",
            layer="business",
            options_type="Yes/No/NA",
            yes_score=5, no_score=0, na_score=0, max_score=5
        ),
        Criterion(
            code="BUS_3.1",
            name="Tư vấn viên có thực hiện quy trình xác thực định danh khách hàng (KYC) không?",
            layer="business",
            options_type="Yes/No/NA",
            yes_score=10, no_score=-5, na_score=0, max_score=10
        ),
        Criterion(
            code="BUS_3.2",
            name="Tư vấn viên có yêu cầu khách hàng xác nhận thông tin cá nhân để bảo đảm bảo mật không?",
            layer="business",
            options_type="Yes/No/NA",
            yes_score=8, no_score=-3, na_score=0, max_score=8
        ),
        Criterion(
            code="BUS_4.1",
            name="Tư vấn viên có giải thích rõ ràng về sản phẩm/dịch vụ mà khách hàng quan tâm không?",
            layer="business",
            options_type="Yes/No/NA",
            yes_score=10, no_score=-3, na_score=0, max_score=10
        ),
        Criterion(
            code="BUS_4.2",
            name="Tư vấn viên có cung cấp thông tin về lãi suất, phí và các điều kiện liên quan không?",
            layer="business",
            options_type="Yes/No/NA",
            yes_score=8, no_score=-2, na_score=0, max_score=8
        ),
        Criterion(
            code="BUS_4.3",
            name="Tư vấn viên có đưa ra khuyến nghị phù hợp với nhu cầu và khả năng tài chính của khách hàng không?",
            layer="business",
            options_type="Yes/No/NA",
            yes_score=12, no_score=-4, na_score=0, max_score=12
        ),
        Criterion(
            code="BUS_6.1",
            name="Tư vấn viên có hướng dẫn khách hàng các bước tiếp theo cần thực hiện không?",
            layer="business",
            options_type="Yes/No/NA",
            yes_score=8, no_score=-2, na_score=0, max_score=8
        ),
        Criterion(
            code="BUS_6.2",
            name="Tư vấn viên có thông báo thời gian xử lý và cách thức liên hệ lại không?",
            layer="business",
            options_type="Yes/No/NA",
            yes_score=5, no_score=0, na_score=0, max_score=5
        ),

        # Layer 3
        Criterion(
            code="AUDIO_RULE",
            name="Giám sát Quy tắc Âm thanh",
            layer="audio_rules",
            options_type="Yes/No",
            yes_score=10, no_score=0, na_score=0, max_score=10,
            audio_rules_data=AudioRuleCriterionData(
                max_hold_time_s=30,
                consultant_speaking_time_ratio_min_percent=40,
                consultant_speaking_time_ratio_max_percent=70,
                max_interruptions=3,
                max_silence_duration_s=10,
                overlapping_threshold_percent=20,
                is_hold_time_enabled=True,
                is_speaker_ratio_enabled=True,
                is_interruptions_enabled=True,
                is_silence_enabled=True
            )
        )
    ]
)

db_scorecards[fallback_sc.id] = fallback_sc

initial_topics = [
    ("T-01", "Khóa thẻ khẩn cấp / Báo mất thẻ"),
    ("T-02", "Cấp lại mật khẩu / Mở khóa SmartBanking"),
    ("T-03", "Tư vấn vay vốn (Tiêu dùng / Mua nhà)"),
    ("T-04", "Đăng ký mở thẻ tín dụng"),
    ("T-05", "Tra soát giao dịch / Khiếu nại trừ tiền"),
    ("T-06", "Tư vấn gửi tiết kiệm & lãi suất"),
    ("T-07", "Khiếu nại thái độ phục vụ / Chất lượng dịch vụ"),
    ("T-08", "Thay đổi thông tin đăng ký (SĐT / Email / OTP)"),
    ("T-09", "Khóa user Smartkids")
]

for t_id, t_name in initial_topics:
    db_mappings[t_id] = TopicMapping(
        topic_id=t_id,
        topic_name=t_name,
        scorecard_id=""  # Initially unmapped
    )
