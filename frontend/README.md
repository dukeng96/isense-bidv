# iSense Scorecard - Frontend

Ứng dụng Frontend Dashboard dành cho Chuyên viên và Quản trị viên tương tác trực tiếp tạo/chỉnh sửa hệ thống Tiêu chí chấm điểm (Scorecards). Frontend map trực tiếp với dịch vụ API FastAPI tại Backend bằng Hook tự động của Tanstack Query và Axios.

## Core Techstack
- **Vite 2 & React 18**: Bundler và thư viện UI cực trơn tru. (Được tối ưu tương thích CommonJS và ES Module ngược). 
- **Tailwind CSS v3**: Triển khai thiết kế Stitch design system sắc nét, nhất quán màu sắc.
- **TanStack Query (React Query)**: Dùng để đồng bộ cache, tối ưu caching data kéo về từ `/scorecards` và mutate `createMapping` tự động revalidate lại state mà không cần Reload.
- **React Router Dom (v6)**: Cấu trúc Multiple Routes Sidebar (Management, Edit, Smart Importer).

## Cấu trúc thư mục
- `api/`: Mapping các config baseAxios với localhost FastAPI.
- `components/Layout/`: 
  - Giao diện vỏ bọc UI đồng bộ (Topbar cố định, Sidebar Navigation Nested Menu).
- `features/`: Chia logic chức năng
  - `importer/`: `SmartImporter` màn hình nhập AI sinh ra giao diện Criterion động.
  - `scorecards/`: Giao diện Dashboard Management chứa Table Quản trị, Mapping Topics, Global Fallback Config. `ScorecardEditor` tương tác từng layer (Nền tảng, Nghiệp vụ, Âm thanh).

## Cách chạy dự án local
Đảm bảo đã chạy Backend API qua port `8000` trước khi boot Frontend. Môi trường Frontend tương thích với `Node v14.17+`.

```bash
# 1. Nhảy vào thư mục cài đặt
cd frontend

# 2. Re-install gói modules
npm install

# 3. Khởi chạy dev server trên cổng 5174/5173
npm run dev
```

Tiến hành mở Browser trên URL hiển thị tại log terminal (Thường là `http://localhost:5174/management` hoặc `5173`).
