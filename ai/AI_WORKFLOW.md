# Luồng Hoạt Động Của Module AI (MediCare AI Service)

Tài liệu này mô tả chi tiết luồng hoạt động (workflow) của hệ thống AI trong dự án MediCare, được xây dựng dựa trên FastAPI (`ai/app` directory).

## 1. Cấu trúc tổng quan
Hệ thống sử dụng FastAPI làm ứng dụng Server chính, kết hợp cơ sở dữ liệu PostgreSQL (có cài đặt ext `pgvector` phục vụ so sánh vector) và Google Gemini (`gemini-3-flash-preview`) với vai trò AI cung cấp nội dung y tế.

Các Gateway (Router) chính được khai báo trong `main.py`:
- Kênh Chat chính: `/ai/chat`
- Kênh Tiên đoán (Dự đoán Topic & Title): `/ai/predict/*`
- Xử lý dữ liệu bệnh học: `/ai/disease`

---

## 2. Luồng Xử Lý Chi Tiết

### A. Luồng Chat Streaming (`/ai/chat`)
Khi người dùng gửi request chứa `session_id` và `user_input` lên hệ thống:

1. **Tiếp nhận Request**: Router nhận thông tin, sau đó truyền vào service RAG qua hàm `rag_service.build_and_stream()`.
2. **Khôi phục ngữ cảnh (Memory)**: Hệ thống sử dụng `session_id` để vào bảng `chat_messages` ở DB lấy ra tối đa 5 tin nhắn giao tiếp gần nhất (sắp xếp tăng dần theo thời gian).
3. **Tạo Embedding Vector**: Tin nhắn lịch sử và câu hỏi mới của người dùng được ghép lại. Nội dung ghép tiếp tục được gửi qua hàm `embedding_service.embed_user_query(text)` để chuyển đổi thành một vector toán học.
4. **Truy xuất thông tin (RAG / CSDL)**:
   - **Tìm kiếm Bệnh (Diseases)**: Dùng `pgvector`, hệ thống mang vector ở bước 3 đi so sánh độ tương đồng cosine (Cosine Similarity) với cột `embedding` của tất cả các bệnh trong bảng `diseases` để truy xuất ra Top 3 bệnh có liên quan nhất.
   - **Gợi ý Bác Sĩ (Doctor Context)**: Hệ thống truy vấn thông tin các bác sĩ nổi bật nhất từ bảng Report là `etl_reports`. Danh sách Bác sĩ này CHỈ ĐƯỢC THÊM VÀO NGỮ CẢNH khi văn bản người dùng nhập xuất hiện các "từ khóa" nhạy cảm liên quan như "bác sĩ", "đặt lịch", "khám bệnh"...
5. **Xây dựng System Prompt (Prompt Dẫn Hướng)**: Tất cả thông tin thu được (**Bao gồm nội dung gợi ý Top 3 bệnh, Thông tin bác sĩ (nếu có), Lịch sử nhắn tin và Đầu vào người dùng**) được ghép lại thành một Prompt lớn chứa luật lệ quy định AI không kê đơn thuốc nặng mà phải khuyên đi khám.
6. **Sinh văn bản Streaming và trả về Client**: Khởi tạo kết nối qua Google GenAI Client (`ai_provider.generate_chat()`). Văn bản sinh ra tới đâu được API Yield ra tới đó ở dạng `text/event-stream`. Người dùng sẽ thấy mặt chữ trên Frontend xuất hiện liên tục như ChatGPT mà không cần chờ toàn bộ văn bản load xong.

### B. Luồng Suy luận thông tin cơ bản (`/ai/predict`)
Phụ trách tự động phát sinh nội dung Metadata như **Tiêu đề (Title)** và **Chuyên khoa (Topic)** dựa trên hội thoại.

#### 1. API: `/ai/predict/title`:
> Tự động tạo tiêu đề cho các cuộc trò chuyện mới.
- Hệ thống lục tìm tin nhắn **đầu tiên** tại `session_id` đang truy vấn.
- Gửi Prompt tới Model AI (`ai_provider.generate_text`) với yêu cầu tóm tắt siêu ngắn tiêu đề trong mức 6 từ.
- Lỡ như kết nối AI gặp trục trặc, có cơ chế chạy ngầm Fallback: Chủ động cắt chuỗi kí tự tự động theo dấu cách, chỉ lấy 6 từ đầu và chèn dấu `...`.
- Kết quả Title lưu lại vào cấu trúc DB của Session (`chat_sessions>title`).

#### 2. API: `/ai/predict/topic`:
> Phân loại cuộc trò chuyện sẽ thuộc về chuyên khoa nào.
- Trích xuất toàn bộ lịch sử trò chuyện biến thành một String kết hợp từ đầu tới cuối.
- Dùng mô hình nhúng (`embedding_service`) để sinh ra một vector cho đoạn History.
- Lọc database ra các danh sách chuyên môn (tên khoa + mô tả của khoa) và lần lượt convert từng chuyên khoa qua vector.
- Bắt đầu duyệt: So sánh độ lệch góc cosine giữa Vector History đọ với từng phần tử Vector Khoa của Database. Vector nào có độ tương phản Cosine sát nút (Score lớn nhất) là người chiến thắng.
- (Nếu Max_Score < 0.1 thì mặc định fallback về Khoa Mặc định: "Nội tổng quát").
- Lưu lại Topic/Chuyên khoa đó vào `chat_sessions`. 

### C. Luồng Tạo Vector cho Bệnh (`/ai/disease`)
- Module này hiện tại (ở code cơ sở) được giữ chỗ trống logic `disease_to_vector`. Đây là Endpoint được dự kiến phục vụ cho các Admin gửi Post API để tự động nhúng (Embed) một bệnh mới vào cấu trúc bảng Postgres.

## 3. Cấu hình AI Foundation (`config/ai_model.py`)
- Định nghĩa class trung tâm `AIProvider` điều phối mọi Call API ra ngoài môi trường Internet qua Google Gemini (`gemini-3-flash-preview`).
- Sở hữu 2 phương thức chính là Stream (gửi chữ lẻ tẻ bằng thẻ Async Generator) và Blocking (chờ render xong toàn bộ đoạn văn bản mới trả về).
- Cơ chế Cảnh Báo An Toàn: Nếu người dùng bỗng nhiên đóng đường truyền Website (ngắt kết nối Client-Sever TCP/IP đột ngột) khi đang Sinh từ Stream. Hàm Stream sẽ gọi `asyncio.CancelledError` đánh sập ngầm luồng tạo text Google AI để tiết kiệm tối ưu chi phí API Key. 
