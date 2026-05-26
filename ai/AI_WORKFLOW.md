# Luồng Hoạt Động Của Module AI (MediAssist AI Service)

Tài liệu này mô tả chi tiết luồng hoạt động (workflow) của hệ thống AI trong dự án **MediAssist**, được xây dựng trên nền **FastAPI** (`ai/app/`), **PostgreSQL + pgvector**, **Google Gemini** (tự động fallback qua các phiên bản), và **SentenceTransformer** (mô hình nhúng tiếng Việt).

---

## 1. Cấu Trúc Tổng Quan

```
ai/
├── app/
│   ├── main.py                  # Entry point FastAPI, đăng ký router & lifecycle
│   ├── api/
│   │   ├── chat.py              # POST /ai/chat
│   │   ├── predict.py           # POST /ai/predict/title | /topic
│   │   └── disease.py           # POST /ai/disease | /medicine | /doctor
│   ├── services/
│   │   ├── rag.py               # Luồng RAG chính (Intent → Vector Search → LLM)
│   │   ├── prediction_service.py# Sinh Title, phân loại Topic chuyên khoa
│   │   ├── embedding_vector_service.py  # Chuyển text → vector (SentenceTransformer)
│   │   └── chunking_service.py  # Chia văn bản thành chunks (size=600, overlap=100)
│   ├── config/
│   │   ├── ai_model.py          # AIProvider: wrapper Gemini với fallback đa model
│   │   ├── database.py          # Kết nối asyncpg PostgreSQL
│   │   ├── pg.py                # Utility truy vấn DB
│   │   └── config.py            # Đọc biến môi trường (.env)
│   └── models/
│       └── models.py            # Pydantic schemas (Request/Response)
```

**Các Router chính:**
| Prefix | File | Chức năng |
|---|---|---|
| `/ai/chat` | `api/chat.py` | Chat streaming RAG |
| `/ai/predict/title` | `api/predict.py` | Tự động sinh tiêu đề phiên chat |
| `/ai/predict/topic` | `api/predict.py` | Phân loại chuyên khoa phiên chat |
| `/ai/disease` | `api/disease.py` | Embed vector bệnh / thuốc / bác sĩ |

---

## 2. Nền Tảng AI (`config/ai_model.py`)

### Class `AIProvider`
Là lớp trung tâm điều phối **mọi lời gọi tới Google Gemini**. Khi một model không phản hồi hoặc bị giới hạn quota, hệ thống tự động fallback sang model kế tiếp theo thứ tự ưu tiên:

```
1. gemini-2.5-flash   (ưu tiên cao nhất)
2. gemini-2.0-flash
3. gemini-1.5-flash
4. gemini-1.5-pro     (dự phòng cuối cùng)
```

**Hai phương thức chính:**

| Phương thức | Mục đích | Trả về |
|---|---|---|
| `generate_chat(prompt)` | Stream từng chunk ký tự | `AsyncGenerator[str]` |
| `generate_full_text(prompt)` | Đợi kết quả đầy đủ rồi trả về 1 lần | `str` |

**Cơ chế bảo vệ tài nguyên:**
- Nếu người dùng đóng trình duyệt giữa chừng, FastAPI phát sinh `asyncio.CancelledError`.
- `generate_chat()` bắt lỗi này và **dừng ngay luồng stream**, tránh tiêu hao API key không cần thiết.

---

## 3. Hệ Thống Embedding (`services/embedding_vector_service.py`)

Sử dụng mô hình **`keepitreal/vietnamese-sbert`** (SentenceTransformer) — được tối ưu cho tiếng Việt.

| Hàm | Đầu vào | Mô tả |
|---|---|---|
| `embed_user_query(text)` | Câu hỏi người dùng | Trả về `list[float]` (vector 1 chiều) |
| `embed_disease_data(name, desc, symptoms)` | Thông tin bệnh | Chunk + embed → `list[dict]` |
| `embed_medicine_data(name, ingredients, usage, side_effects)` | Thông tin thuốc | Chunk + embed → `list[dict]` |
| `embed_doctor_data(name, specialty, experience, education)` | Thông tin bác sĩ | Chunk + embed → `list[dict]` |

### Chunking (`services/chunking_service.py`)
Trước khi embed dữ liệu dài, văn bản được chia thành các đoạn nhỏ:
- **Chunk size**: tối đa `600` ký tự mỗi đoạn.
- **Overlap**: `100` ký tự chồng lấp giữa các đoạn liên tiếp để giữ ngữ cảnh.
- Ưu tiên cắt tại ranh giới câu (`.`, `!`, `?`) thay vì cắt ngang từ.

---

## 4. Luồng Chat RAG (`/ai/chat`) — Chi Tiết Từng Bước

Đây là luồng phức tạp và cốt lõi nhất của hệ thống. Hàm xử lý chính: `rag_service.build_and_stream(session_id, user_input)`.

```
Client (POST /ai/chat)
        │
        ▼
   [Bước 1] Lấy lịch sử chat (6 tin nhắn gần nhất từ DB)
        │
        ▼
   [Bước 2] Rewrite Query + Tạo Embedding Vector
        │
        ▼
   [Bước 3] Phân loại Intent (classify_intent)
        │
        ├── symptom_inquiry / general_health / emergency
        │       └── → Tìm kiếm Bệnh (disease_chunks)
        │
        ├── medicine_inquiry
        │       └── → Tìm kiếm Thuốc (medicine_chunks)
        │
        └── doctor_search / appointment_booking / emergency
                └── → Tìm kiếm Bác sĩ (doctor_chunks) + ETL Top Bác sĩ
        │
        ▼
   [Bước 4] Xây dựng Prompt đầy đủ (Context + Lịch sử + Câu hỏi)
        │
        ▼
   [Bước 5] Gọi Gemini (Stream) → Yield từng chunk tới Client
        │
        ▼
   [Bước 6] Lưu phản hồi AI vào bảng chat_messages
```

### Bước 1 — Khôi phục ngữ cảnh (Memory)
```sql
SELECT role, content FROM chat_messages
WHERE session_id = $1
ORDER BY created_at DESC LIMIT 6
```
Lấy **6 tin nhắn gần nhất** (cả User và AI), đảo ngược thứ tự để ra timeline tự nhiên. Đây chính là "bộ nhớ ngắn hạn" của chatbot.

### Bước 2 — Viết lại câu hỏi + Tạo Vector
- **Rewrite Query (`rewrite_query`)**: Gửi lịch sử + câu hỏi mới tới Gemini để viết lại thành một câu truy vấn **độc lập, đầy đủ ngữ nghĩa** (xử lý trường hợp người dùng nói tắt như "bệnh đó có thuốc gì không?").
- Nếu không có lịch sử hoặc LLM lỗi → dùng nguyên `user_input` gốc.
- Câu truy vấn sau khi rewrite được chuyển thành **embedding vector** qua `embedding_service.embed_user_query()`.

### Bước 3 — Phân loại Intent
Gọi `classify_intent(history_text, user_input)` — một lời gọi LLM nhỏ để phân loại câu hỏi vào đúng nhãn:

| Intent | Mô tả |
|---|---|
| `symptom_inquiry` | Hỏi về triệu chứng, nguyên nhân bệnh |
| `medicine_inquiry` | Hỏi về thuốc, thành phần, tác dụng phụ |
| `doctor_search` | Tìm bác sĩ, chuyên khoa phù hợp |
| `appointment_booking` | Đặt lịch hẹn khám |
| `general_health` | Tư vấn sức khỏe tổng quát |
| `emergency` | Tình huống khẩn cấp, triệu chứng nguy hiểm |

### Bước 4 — Truy xuất dữ liệu theo Intent (Vector Search)
Hệ thống **chỉ truy vấn bảng liên quan** dựa trên intent để tránh nhiễu:

| Intent | Bảng DB được truy vấn |
|---|---|
| `symptom_inquiry`, `general_health`, `emergency` | `disease_chunks` |
| `medicine_inquiry` | `medicine_chunks` |
| `doctor_search`, `appointment_booking`, `emergency` | `doctor_chunks` + `etl_reports` |

**Chiến lược tìm kiếm Hybrid (Vector + Keyword):**
```sql
-- Ví dụ: disease_chunks
SELECT d.name, dc.content, (1 - (dc.embedding <=> $1::vector)) as score
FROM disease_chunks dc JOIN diseases d ON dc.disease_id = d.id
WHERE (1 - (dc.embedding <=> $1::vector)) > 0.4     -- Lọc theo ngưỡng cosine similarity
   OR $2 ILIKE '%' || d.name || '%'                  -- Hoặc khớp tên bệnh trực tiếp
ORDER BY
   (CASE WHEN $2 ILIKE '%' || d.name || '%' THEN 1 ELSE 0 END) DESC,  -- Ưu tiên match tên
   dc.embedding <=> $1::vector                        -- Sau đó sort theo khoảng cách vector
LIMIT 3
```
- **Vector Search**: Dùng `pgvector` + Cosine Similarity, ngưỡng `> 0.4`.
- **Keyword Fallback**: Nếu tên bệnh/thuốc/bác sĩ xuất hiện rõ trong câu hỏi → ưu tiên kết quả đó lên đầu.
- Lấy **Top 3** kết quả cho mỗi loại.

**Gợi ý bác sĩ từ ETL Reports:**
- Khi intent là `doctor_search` hoặc `appointment_booking`, hệ thống truy vấn thêm bảng `etl_reports` (report `top_doctors`) để đưa ra gợi ý các bác sĩ nổi bật nhất theo dữ liệu phân tích.

### Bước 5 — Xây dựng Prompt & Sinh văn bản Streaming
Tất cả dữ liệu thu được được ghép thành một **System Prompt** có cấu trúc:

```
Bạn là trợ lý y tế AI (MediAssist).

[Ngữ cảnh tham khảo]
Bệnh: ... / Thuốc: ... / Bác sĩ phù hợp: ... / Gợi ý Top Bác sĩ: ...

[Lịch sử hội thoại]
User: ...
AI: ...

[Câu hỏi hiện tại]
...

[Quy tắc]
- Trả lời ngắn gọn, chính xác, thân thiện.
- Chỉ gợi ý bác sĩ khi người dùng hỏi liên quan.
- Không kê đơn thuốc nặng, khuyến khích đi khám trực tiếp.
```

Văn bản được stream qua `ai_provider.generate_chat(prompt)` — mỗi chunk nhỏ được **`yield` ngay lập tức** về phía Client qua `StreamingResponse(media_type="text/event-stream")`, tạo hiệu ứng in chữ dần như ChatGPT.

### Bước 6 — Lưu phản hồi
Sau khi stream hoàn tất, **toàn bộ nội dung AI phản hồi** được tích lũy vào biến `full_response` và lưu vào bảng `chat_messages` với `role = "AI"`.

---

## 5. Luồng Dự Đoán Metadata (`/ai/predict`)

### A. Sinh Tiêu Đề (`POST /ai/predict/title`)
> Tự động đặt tên cho phiên chat mới dựa trên tin nhắn đầu tiên.

1. Nhận `first_message` từ request body.
2. Gửi Prompt tới `ai_provider.generate_text()`: *"Tóm tắt thành tiêu đề tối đa 6 từ"*.
3. **Fallback thủ công** nếu LLM lỗi: cắt lấy 6 từ đầu và thêm `...`.
4. Trả về `TitlePredictResponse(title=...)`.

> ⚠️ Lưu ý: `predict/title` **không tự lưu DB** — backend chính (NestJS) chịu trách nhiệm gọi API này và lưu kết quả.

### B. Phân Loại Chuyên Khoa (`POST /ai/predict/topic`)
> Tự động gắn nhãn phiên chat thuộc chuyên khoa y tế nào.

1. Lấy toàn bộ lịch sử chat theo `session_id` từ DB.
2. Ghép tất cả nội dung thành một chuỗi dài → embed thành **vector lịch sử**.
3. Lấy danh sách tất cả chuyên khoa từ bảng `specialties` (id, name, description).
4. Embed từng chuyên khoa thành vector (tên + mô tả).
5. Tính **Cosine Similarity** giữa vector lịch sử và từng vector chuyên khoa.
6. Chọn chuyên khoa có **score cao nhất**. Nếu `max_score < 0.1` → fallback về *"Nội tổng quát"*.
7. Cập nhật `chat_sessions.topic` trong DB.

---

## 6. Luồng Tạo Vector Dữ Liệu Y Tế (`/ai/disease`)

Các endpoint này được gọi bởi **Admin/Backend** để nhúng dữ liệu mới vào knowledge base:

| Endpoint | Dữ liệu | Bảng lưu |
|---|---|---|
| `POST /ai/disease` | Tên bệnh, mô tả, triệu chứng | `disease_chunks` |
| `POST /ai/disease/medicine` | Tên thuốc, thành phần, hướng dẫn, tác dụng phụ | `medicine_chunks` |
| `POST /ai/disease/doctor` | Tên bác sĩ, chuyên khoa, kinh nghiệm, học vấn | `doctor_chunks` |

**Quy trình xử lý chung:**
1. Ghép các trường thông tin thành một văn bản đầy đủ.
2. Chia nhỏ thành chunks (`ChunkingService`).
3. Embed từng chunk thành vector (`EmbeddingService`).
4. Trả về danh sách chunks + vectors cho backend lưu vào DB.

---

## 7. Tóm Tắt Kiến Trúc RAG

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Input                               │
└───────────────────────────┬─────────────────────────────────────┘
                            │
              ┌─────────────▼─────────────┐
              │   Query Rewriting (LLM)   │  ← Gemini (fallback chain)
              └─────────────┬─────────────┘
                            │
              ┌─────────────▼─────────────┐
              │  Intent Classification    │  ← Gemini (6 nhãn intent)
              └─────────────┬─────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         ▼                  ▼                  ▼
  Disease Search     Medicine Search    Doctor Search
  (pgvector +        (pgvector +        (pgvector +
   keyword)           keyword)           keyword +
                                        ETL Reports)
         └──────────────────┬──────────────────┘
                            │
              ┌─────────────▼─────────────┐
              │    Prompt Construction    │
              │  Context + History + Q    │
              └─────────────┬─────────────┘
                            │
              ┌─────────────▼─────────────┐
              │  LLM Generation (Stream)  │  ← Gemini (fallback chain)
              └─────────────┬─────────────┘
                            │
              ┌─────────────▼─────────────┐
              │   StreamingResponse       │  → text/event-stream
              └─────────────┬─────────────┘
                            │
              ┌─────────────▼─────────────┐
              │  Save to chat_messages    │  ← PostgreSQL
              └───────────────────────────┘
```
