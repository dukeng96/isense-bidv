export interface Hotline {
  id: string;
  name: string;
  phone: string;
}

export interface Branch {
  id: string;
  hotline_id: string;
  name: string;
}

export interface TopicLocal {
  id: string;
  branch_id: string;
  name: string;
  description: string;
  // status: 'Active' | 'Inactive'; // removed based on user request
}

const STORAGE_KEY = 'isense_funnel_store';

export interface FunnelData {
  hotlines: Hotline[];
  branches: Branch[];
  topics: TopicLocal[];
}

const INITIAL_DATA: FunnelData = {
  hotlines: [
    { id: 'H-19009247', name: 'Hotline cá nhân', phone: '1900 9247' },
    { id: 'H-19009248', name: 'Hotline doanh nghiệp', phone: '1900 9248' },
    { id: 'H-1800969659', name: 'Hotline ưu tiên (Private/Premier)', phone: '1800 969 659' },
    { id: 'H-02422200588', name: 'Hỗ trợ quốc tế / Dự phòng', phone: '024 2220 0588' }
  ],
  branches: [
    // Branches for 1900 9247
    { id: 'B-1-0', hotline_id: 'H-19009247', name: 'Phím 0: Hỗ trợ chung (Gặp ĐTV)' },
    { id: 'B-1-1', hotline_id: 'H-19009247', name: 'Phím 1: Dịch vụ Thẻ ngân hàng' },
    { id: 'B-1-2', hotline_id: 'H-19009247', name: 'Phím 2: Ngân hàng điện tử (SmartBanking)' },
    { id: 'B-1-3', hotline_id: 'H-19009247', name: 'Phím 3: Tra cứu thông tin' },
    { id: 'B-1-4', hotline_id: 'H-19009247', name: 'Phím 4: Khóa thẻ khẩn cấp / Tỷ giá & Lãi suất' },
    { id: 'B-1-5', hotline_id: 'H-19009247', name: 'Phím 5: Thẻ tín dụng & Số tài khoản' },
  ],
  topics: [
    // Phím 0
    { id: 'T-0-1', branch_id: 'B-1-0', name: 'Tìm hiểu mạng lưới Chi nhánh/ATM', description: 'Khách hàng hỏi về địa chỉ, giờ làm việc của chi nhánh hoặc vị trí cây ATM gần nhất.' },
    { id: 'T-0-2', branch_id: 'B-1-0', name: 'Khiếu nại chất lượng dịch vụ', description: 'Phản ánh về thái độ phục vụ của nhân viên tại quầy hoặc các vấn đề gây không hài lòng chung.' },
    { id: 'T-0-3', branch_id: 'B-1-0', name: 'Tư vấn gói tài khoản / Dịch vụ khác', description: 'Hỏi về các gói tài khoản thanh toán, phí quản lý tài khoản hoặc các dịch vụ không nằm trong các phím bấm khác.' },
    // Phím 1
    { id: 'T-1-1', branch_id: 'B-1-1', name: 'Kích hoạt thẻ và Tạo mã PIN', description: 'Hướng dẫn khách hàng kích hoạt thẻ mới nhận hoặc thay đổi mã PIN trên ứng dụng/ATM.' },
    { id: 'T-1-2', branch_id: 'B-1-1', name: 'Lỗi giao dịch tại ATM', description: 'Thẻ bị nuốt, giao dịch rút tiền không thành công nhưng tài khoản vẫn bị trừ tiền.' },
    { id: 'T-1-3', branch_id: 'B-1-1', name: 'Tư vấn phí thường niên và hạn mức thẻ nội địa', description: 'Giải đáp các thắc mắc về biểu phí và hạn mức chi tiêu của thẻ ghi nợ nội địa.' },
    // Phím 2
    { id: 'T-2-1', branch_id: 'B-1-2', name: 'Lỗi đăng nhập và Quên mật khẩu', description: 'Khách hàng không đăng nhập được app, bị khóa user do nhập sai pass hoặc cần cấp lại mật khẩu.' },
    { id: 'T-2-2', branch_id: 'B-1-2', name: 'Lỗi nhận mã OTP (SMS/Smart OTP)', description: 'Khách hàng thực hiện giao dịch nhưng không nhận được mã xác thực để hoàn tất.' },
    { id: 'T-2-3', branch_id: 'B-1-2', name: 'Đăng ký/Hủy dịch vụ SmartBanking', description: 'Yêu cầu đăng ký mới, thay đổi gói dịch vụ hoặc hủy sử dụng ngân hàng điện tử.' },
    // Phím 3
    { id: 'T-3-1', branch_id: 'B-1-3', name: 'Tra cứu số dư tài khoản', description: 'Kiểm tra số dư hiện có trong các tài khoản thanh toán.' },
    { id: 'T-3-2', branch_id: 'B-1-3', name: 'Kiểm tra lịch sử giao dịch gần nhất', description: 'Xác nhận các biến động số dư, nội dung chuyển khoản trong thời gian gần đây.' },
    { id: 'T-3-3', branch_id: 'B-1-3', name: 'Kiểm tra trạng thái hồ sơ/yêu cầu', description: 'Tra cứu xem các yêu cầu tra soát hoặc hồ sơ đã gửi trước đó đã được xử lý chưa.' },
    // Phím 4
    { id: 'T-4-1', branch_id: 'B-1-4', name: 'Khóa thẻ do mất/thất lạc', description: 'Yêu cầu khóa thẻ ngay lập tức để bảo đảm an toàn tài sản.' },
    { id: 'T-4-2', branch_id: 'B-1-4', name: 'Tạm dừng giao dịch nghi ngờ gian lận', description: 'Khách hàng phát hiện giao dịch bất thường và yêu cầu can thiệp khẩn cấp.' },
    { id: 'T-4-3', branch_id: 'B-1-4', name: 'Tra cứu tỷ giá ngoại tệ và lãi suất tiết kiệm', description: 'Hỏi về thông giá vàng, tỷ giá các loại ngoại tệ hoặc mức lãi suất gửi tiền mới nhất.' },
    // Phím 5
    { id: 'T-5-1', branch_id: 'B-1-5', name: 'Tư vấn mở thẻ tín dụng mới', description: 'Tìm hiểu điều kiện, hồ sơ và các dòng thẻ tín dụng (Visa/Mastercard) của BIDV.' },
    { id: 'T-5-2', branch_id: 'B-1-5', name: 'Tra cứu số tài khoản cá nhân', description: 'Khách hàng quên số tài khoản và cần điện thoại viên hỗ trợ cung cấp lại.' },
    { id: 'T-5-3', branch_id: 'B-1-5', name: 'Thanh toán dư nợ thẻ tín dụng', description: 'Hướng dẫn cách thanh toán sao kê, ngày đến hạn và các vấn đề về lãi quá hạn thẻ tín dụng.' }
  ]
};

export const mockFunnelStore = {
  // Always override with INITIAL_DATA strictly for POC seeding, or use a versioning 
  // to force flush old local storage
  getData: (): FunnelData => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        // Force flush if it misses the new structures (H-1800969659 presence)
        if (!parsed.hotlines.find((h: any) => h.id === 'H-1800969659')) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
          return INITIAL_DATA;
        }
        return parsed;
      }
    } catch(e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  },
  
  saveData: (data: FunnelData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },
  
  addTopic: (topic: TopicLocal) => {
    const data = mockFunnelStore.getData();
    data.topics.push(topic);
    mockFunnelStore.saveData(data);
  },
  
  updateTopic: (id: string, updates: Partial<TopicLocal>) => {
    const data = mockFunnelStore.getData();
    data.topics = data.topics.map(t => t.id === id ? { ...t, ...updates } : t);
    mockFunnelStore.saveData(data);
  }
};
