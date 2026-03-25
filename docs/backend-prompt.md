Code backend cho hệ thống iSense Scorecard. Viết các RESTful API cho các chức năng sau:

- Scorecard CRUD: Cho phép lưu bộ tiêu chí nháp từ AI, chỉnh sửa và xóa.
- Mapping Service: API để gán Topic vào Scorecard.
- Scoring Logic: Nếu topic_name tồn tại trong Mapping -> Trả về Scorecard đó. Nếu không -> Trả về Scorecard có IsGlobalFallback = True.
Đảm bảo các API đều có validation dữ liệu chặt chẽ
- Viết một mock API endpoint /api/ai/generate-scorecard nhận raw_text và trả về List<Criterion>, phục vụ cho màn Smart Importer. Output mock như screenshot `Chỉnh sửa bộ tiêu chí chấm điểm`

