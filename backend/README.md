# iSense Scorecard - Backend

Backend service cho hệ thống Quản lý tiêu chí chấm điểm cuộc gọi (Scorecards) của iSense. Được xây dựng dựa trên FastAPI và Pydantic, cung cấp các chuẩn JSON API phục vụ Dashboard Front-end thao tác nghiệp vụ, mapping topic và engine AI tạo dữ liệu thông minh.

## Công nghệ & Thư viện
- **FastAPI**: Backend framework siêu tốc, xây dựng API asynchoronous.
- **Pydantic (v2)**: Core logic cho Data Validation của các entity (Criterion, Scorecard, TopicMapping).
- **Uvicorn**: Server ASGI nhẹ, khởi chạy nhanh môi trường Python.

## Cấu trúc thư mục
- `models.py`: Chứa mọi định nghĩa Pydantic (Layers, Fallback Flags, Criteria fields).
- `database.py`: In-memory data store mock lưu trữ danh sách Scorecard và cấu hình Mapping. 
- `routers/`: Tách module định tuyến API.
  - `scorecards.py`: CRUD Quản trị sinh các bộ quy tắc.
  - `mappings.py`: API gán Map bộ quy tắc với "Chủ đề cuộc gọi" (Topic), cấu hình Fallback mặc định.
  - `scoring.py`: Controller cho Engine bên thứ 3 móc vào truy vấn thông minh lấy bộ tiêu chí đúng dựa theo tên Topic truyền vào.
  - `ai.py`: API `/generate-scorecard` (Trí tuệ nhân tạo giả lập tự phân tích văn bản sinh tiêu chí).
- `main.py`: File khởi tạo service, config CORS.
- `test_api.py`: Automation Testing TestClient của FastAPI đảm bảo toàn bộ Endpoint hoạt động đúng spec.

## Cách chạy dự án Local
Yêu cầu: `Python 3.8+`
```bash
# 1. cd vào thư mục backend
cd backend

# 2. Tạo môi trường ảo
python3 -m venv venv
source venv/bin/activate

# 3. Cài đặt các thư viện
pip install fastapi uvicorn pydantic

# 4. Chạy service qua cổng 8000
uvicorn main:app --reload --port 8000
```
Server Swagger tự động tạo tài liệu test API tại: `http://localhost:8000/docs`
