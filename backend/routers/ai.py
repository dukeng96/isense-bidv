from fastapi import APIRouter
from typing import List
from models import Criterion, GenerateScorecardRequest
import database as db

router = APIRouter(prefix="/ai", tags=["AI Generate Mock"])

@router.post("/generate-scorecard", response_model=List[Criterion])
def generate_scorecard(request: GenerateScorecardRequest):
    # Fetch global fallback to persist standard general & audio criteria
    fallback_sc = db.get_global_fallback_scorecard()
    base_criteria = fallback_sc.criteria if fallback_sc else []
    
    general_criteria = [c for c in base_criteria if c.layer == 'general']
    audio_criteria = [c for c in base_criteria if c.layer == 'audio_rules']
    
    # Hardcoded business criteria from the provided screenshot
    business_criteria_data = [
        # Nhận diện và tiếp nhận yêu cầu
        ("1.1", "TVV có xác định đúng nhu cầu của khách hàng là khóa user SmartKids/người dùng phụ không?", 8, -5, 0, 8),
        ("1.2", "TVV có khai thác nguyên nhân khách hàng muốn khóa user SmartKids không?", 5, 0, 0, 5),
        ("1.3", "TVV có hỏi thêm thông tin cần thiết để làm rõ tình huống trước khi xử lý không?", 5, 0, 0, 5),
        
        # Xác thực khách hàng
        ("2.1", "TVV có thực hiện hỏi bộ câu hỏi xác thực Khách hàng trong cuộc gọi không?", 10, -10, 0, 10),
        ("2.2", "TVV có hỏi đủ số lượng tối thiểu câu hỏi xác thực theo quy định không?", 10, -5, 0, 10),
        ("2.3", "TVV có hỏi đủ 3 câu bắt buộc thuộc nhóm 1 không?", 8, -5, 0, 8),
        ("2.4", "TVV có sử dụng đúng các câu hỏi thuộc danh mục câu hỏi xác thực được phép không?", 8, -5, 0, 8),
        
        # Tuân thủ xử lý trong lời thoại
        ("3.1", "Nếu khách hàng đáp ứng xác thực và điều kiện áp dụng, TVV có chuyển sang hướng xử lý khóa user không?", 8, -5, 0, 8),
        ("3.2", "Nếu khách hàng có từ hai người dùng phụ trở lên, TVV có hỏi rõ user nào cần khóa không?", 6, -3, 0, 6),
        ("3.3", "Nếu khách hàng không đáp ứng xác thực hoặc không đủ điều kiện áp dụng, TVV có hướng dẫn khách hàng tự thao tác trên ứng dụng và đóng yêu cầu không?", 6, -5, 0, 6),
        ("3.4", "TVV có chốt rõ hướng xử lý tiếp theo cho khách hàng không?", 8, 0, 0, 8),
        
        # Lưu ý và khuyến nghị theo tình huống
        ("4.1", "Nếu nguyên nhân là mất điện thoại của người dùng phụ, TVV có khuyến nghị liên hệ nhà mạng để khóa SIM 2 chiều không?", 6, -3, 0, 6),
        ("4.2", "Nếu có dấu hiệu lừa đảo/lộ thông tin/nguy cơ gian lận, TVV có hướng dẫn khách hàng khai báo cơ quan chức năng có thẩm quyền không?", 8, -5, 0, 8),
        ("4.3", "Nếu khách hàng phản ánh bị trừ tiền/giao dịch không do mình thực hiện trên SmartBanking, TVV có hướng dẫn khách hàng kiểm tra khả năng lộ thông tin bảo mật, truy cập link lạ không?", 8, -5, 0, 8),
        ("4.4", "Nếu khách hàng phản ánh phát sinh giao dịch bất thường cần hỗ trợ tiếp, TVV có hướng dẫn gửi yêu cầu tra soát/thu hồi tiền theo quy trình không?", 8, -5, 0, 8),
        ("4.5", "Nếu khách hàng cung cấp thông tin về link giả mạo/trang giả mạo, TVV có hướng dẫn ghi nhận/chuyển thông tin theo đầu mối được quy định không?", 5, -3, 0, 5)
    ]
    
    business_criteria = []
    for code, name, yes_sc, no_sc, na_sc, max_sc in business_criteria_data:
        business_criteria.append(Criterion(
            code=f"BUS_{code}",
            name=name,
            layer="business",
            options_type="Yes/No/NA",
            yes_score=yes_sc,
            no_score=no_sc,
            na_score=na_sc,
            max_score=max_sc
        ))

    return general_criteria + business_criteria + audio_criteria
