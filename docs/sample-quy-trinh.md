# **VÍ DỤ ĐỊNH NGHĨA YÊU CẦU CHẤM ĐIỂM NGHIỆP VỤ CỦA BIDV (BAO GỒM NHƯNG KHÔNG GIỚI HẠN)** 

| TT | Câu hỏi nghiệp vụ có thể sử dụng | Cách thức đối chiếu/chấm điểm | Ví dụ Cách thức về khai báo chấm điểm | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | TVV đã thực hiện hỗ trợ đúng kênh tiếp nhận chưa | Bot tự động lấy được thông tin từ trường “Kênh tiếp nhận” từ Sample Bot tự so sánh với metadata về kênh tiếp nhận trên hệ thống CC và đưa ra nhận định | Đúng kênh tiếp nhận: Không trừ điểm Sai kênh tiếp nhận: Trừ 5 điểm |  |
| 2 | TVV đã xác thực đúng và đủ BCH xác thực hay chưa | Bot tự động lấy được thông tin từ trường “Bộ câu hỏi xác thực” từ Sample để biết: Với quy trình này thì sử dụng số lượng bộ câu hỏi là bao nhiêu câu; những câu hỏi đó đã đúng với những câu hỏi được phép hỏi hay chưa Bot dùng AI để:  \+ Đếm số lượng câu hỏi mà TVV đã sử dụng, sau đó đối chiếu với số lượng bộ câu hỏi đã lấy từ trong sample để biết TVV đã hỏi ĐỦ BCH hay chưa \+ So sánh các từ khóa trong những câu hỏi mà TVV đã sử dụng với từ khóa trong danh mục BCH ở trong sample để biết TVV đã hỏi ĐÚNG BCH hay chưa | Đủ và đúng BCH xác thực: Không trừ điểm Không đủ BCH xác thực: \+ Hỏi thừa/thiếu 1 câu: Trừ 5 điểm \+ Hỏi thừa/thiếu 2 câu: Trừ 10 điểm \+ Hỏi thừa/thiếu từ 2 câu trở lên: Mặc định trừ hết điểm Không đúng thông tin xác thực: \+     Hỏi sai 1 câu hỏi: Trừ 5 điểm \+     Hỏi sai 2 câu hỏi: Trừ 10 điểm \+     Hỏi sai từ 2 câu trở lên hoặc dung sai BCH: Mặc định trừ hết điểm | Yêu cầu cơ bản, đã mô tả với đối tác |
| 3 | TVV có tuân thủ các bước trong quy trình hay không | Bot tự động lấy được thông tin từ trường “Quy trình thực hiện” từ Sample Bot dùng AI để: \+ Tóm tắt nội dung của tương tác với KH \+ Phán đoán phần nội dung mà TVV đã đề cập trong cuộc thoại thuộc về bước nào trong sample \+ So sánh nếu TVV có làm THIẾU các bước hay không (ví dụ, trong sample có yêu cầu TVV khuyến nghị KH liên hệ cơ quan công an, vậy đã khuyến nghị chưa) | Tuân thủ đúng quy trình: Không trừ điểm Tuân thủ thiếu 1 bước trong quy trình: Trừ 5 điểm Tuân thủ thiếu từ 1 bước trở lên: Mặc định trừ hết điểm | Yêu cầu cơ bản, đã mô tả với đối tác |
| 4 | TVV đã thực hiện tác nghiệp theo quy trình  hay chưa | Bot tự động lấy được thông tin từ trường “Hướng dẫn tác nghiệp” Bot hoặc (1) Truy cập vào các backend của BIDV hoặc (2) Truy cập vào metadata log tác động của Contact Center để so sánh nếu trạng thái dịch vụ của khách hang đã thay đổi như yêu cầu của quy trình | Tác nghiệp thành công: Không trừ điểm Tác nghiệp thiếu/GSV chưa duyệt: Trừ 5 điểm Chưa tác nghiệp/Tác nghiệp nhầm sang nghiệp vụ khác hoặc KH khác: Mặc định trừ hết điểm | Yêu cầu không bắt buộc |
|  | Khác…. | ……….. |  |  |

# 

# **SAMPLE**

1. # **Quy trình Khóa user SmartKids**

1) **Kênh tiếp nhận:** Thoại, Livechat.   
2) **Điều kiện áp dụng:**  
- Khách hàng cá nhân là người dùng chính dịch vụ Smartbanking có nhu cầu khóa dịch vụ của người dùng phụ.  
- Khách hàng được xác thực đủ thông tin theo bộ câu hỏi xác thực (lấy các thông tin tại UCX/CoreProfile làm cơ sở)  
3) **Bộ câu hỏi xác thực:** Áp dụng theo bộ câu hỏi **mức độ rủi ro thấp** (Theo quy định hiện hành là KH phải trả lời đúng **05 câu** (03 câu bắt buộc, 02 câu lựa chọn bất kỳ trong nhóm 2/nhóm 3 danh mục BCH)  
   Danh mục BCH xác thực như sau:

| Nhóm 1: câu hỏi bắt buộc | Nhóm 2: câu hỏi lựa chọn (tính chất riêng tư, có thay đổi) | Nhóm 3: câu hỏi lựa chọn thông thường |
| :---- | :---- | :---- |
|   1\. Họ và tên 2\. Số CMND/CCCD 3**.** Số điện thoại KH có trên hệ thống/đăng ký dịch vụ  | \- Số lượng thẻ phụ đã phát hành \- Chi nhánh gửi tiết kiệm \- Chi nhánh cho vay \- Số tiền vay (ban đầu/hiện tại) | Số tài khoản đã đăng ký tại ngân hàng (bất kỳ) Địa chỉ email (trên webCSR) Địa chỉ KH đăng ký với NH (trên webCSR) |

4) **Quy trình thực hiện**

|  Bước | Người thực hiện | Quy trình chi tiết | Chương trình |
| :---- | :---- | :---- | :---- |
| Bước 1 | TVV TTCSKH | **Tiếp nhận yêu cầu:** Khai thác nguyên nhân khách hàng muốn khóa user Smartkids: **\-** Người dùng phụ bị mất điện thoại; **\-** Người dùng chính bị trừ tiền trong tài khoản mà người dùng chính/người dùng phụ không thực hiện giao dịch; **\-** Người dùng phụ bị lừa đảo, lộ thông tin do nguy cơ gian lận giả mạo. **\-** Các nguyên nhân khác. **Xác thực khách hàng**: \- Trường hợp KH đáp ứng được bộ câu hỏi xác thực và các điều kiện áp dụng,  chuyển sang Bước 2\. \- Trường hợp người dùng chính có từ hai người dùng phụ trở lên, TVV khai thác về user mà người dùng chính muốn khóa. \- Trường hợp KH không đáp ứng được bộ câu hỏi xác thực hoặc các điều kiện áp dụng, TVV hướng dẫn người dùng chính có thể tự thao tác trên ứng dụng, sau đó đóng yêu cầu. *\- Đối với các trường hợp lửa đảo, lộ thông tin do nguy cơ gian lận giả mạo, TVV thực hiện khóa theo yêu cầu từ phía ĐVLQ/Cơ quan chức năng theo các văn bản hướng dẫn phù hợp từng thời kỳ.* | UCX Chương trình Backend Smartbanking  |
| Bước 2 | TVV TTCSKH | **Thực hiện tác nghiệp** \- TVV chọn chức năng Khách hàng SmartKids \=\>Quản lý người dùng SmartKids \-\> Tìm kiếm \-\> Biểu tượng “Khóa dịch vụ” \=\> Nhập thông tin Ghi chú (nếu có) \=\> Gửi Phê duyệt. | Chương trình Backend Smartbanking  |
| Bước 3 | GSV TTCSKH | **Duyệt khóa dịch vụ và đóng PYC** | Chương trình Backend Smartbanking |
| Bước 4 | Cán bộ hậu kiểm | **Hậu kiểm tác nghiệp hủy dịch vụ** \- Vào ngày T+1, cán bộ hậu kiểm thực hiện hậu kiểm theo hướng dẫn tại Phụ lục.... | UCX  |
| Bước 5 | Các lưu ý khác | Sau khi thực hiện tác nghiệp khóa dịch vụ cho khách hàng: **1.  Trường hợp người dùng phụ bị mất điện thoại:** TVV khuyến cáo người dùng chính liên hệ nhà mạng để **khóa sim 2 chiều của người dùng phụ** để tránh rủi ro phát sinh. **2.  Trường hợp Người dùng chính bị trừ tiền trong tài khoản mà người dùng chính/phụ không thực hiện giao dịch (phủ nhận giao dịch và yêu cầu BIDV cung cấp thông tin liên quan):** ***2.1. Trường hợp giao dịch liên quan giao dịch nạp ví điện tử/TTHĐOL:*** Thực hiện theo **Quy trình hỗ trợ khiếu nại đối với dịch vụ Ví điện tử** của Cẩm nang Hỗ trợ khách hàng tại TTCSKH từng thời kỳ. ***2.2. Trường hợp giao dịch là giao dịch thực hiện trên ứng dụng Smartbanking,*** TVV thực hiện các bước như sau: **Bước 1:**  TVV kiểm tra thông tin khách hàng cung cấp với dữ liệu hệ thống tại Backoffice Smartbanking: **Bước 2:**  \- Hướng dẫn khách hàng kiểm tra lại tại thời điểm phát sinh giao dịch khiếu nại, khách hàng có cung cấp thông tin cá nhân, thông tin bảo mật dịch vụ SmartBanking cho đối tượng khác không, thiết bị nhận OTP của khách hàng có cài đặt, truy cập ứng dụng/ link giả mạo hoặc bị kẻ gian lợi dụng không. \- Hướng dẫn khách hàng thực hiện khai báo cơ quan chức năng có thẩm quyền. BIDV sẽ phối hợp cung cấp thông tin liên quan khi có công văn của cơ quan điều tra. \- Hỗ trợ gửi yêu cầu tra soát thu hồi tiền theo quy trình tại Cẩm nang HTKH từng thời kỳ. **Bước 3:**  TVV gửi thông tin đường link giả mạo về địa chỉ email xxx@bidv.com.vn để TTCNTT gửi website giả mạo này tới Cục ATTT và yêu cầu ngăn chặn. |  |

