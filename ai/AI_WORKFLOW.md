# Luồng Hoạt Động Của Module AI — MediAssist AI Service

Tài liệu mô tả chi tiết kiến trúc và luồng xử lý của hệ thống AI trong dự án **MediAssist**, xây dựng trên **FastAPI**, **PostgreSQL + pgvector**, **Google Gemini** (fallback chain), và **SentenceTransformer** (embedding tiếng Việt).

---

## 1. Cấu Trúc Thư Mục

```
ai/
├── app/
│   ├── main.py                          # Entry point FastAPI, lifecycle & router
│   ├── api/
│   │   ├── chat.py                      # POST /ai/chat  → streaming RAG
│   │   ├── predict.py                   # POST /ai/predict/title | /topic
│   │   └── disease.py                   # POST /ai/disease | /medicine | /doctor
│   ├── services/
│   │   ├── rag.py                       # Pipeline RAG chính (Intent → Vector → LLM)
│   │   ├── prediction_service.py        # Sinh title, phân loại topic chuyên khoa
│   │   ├── embedding_vector_service.py  # text → vector (SentenceTransformer)
│   │   └── chunking_service.py          # Chia văn bản thành chunks (600 ký tự, overlap 100)
│   ├── config/
│   │   ├── ai_model.py                  # AIProvider: Gemini wrapper + fallback + configs
│   │   ├── database.py                  # asyncpg connection pool
│   │   └── config.py                    # Biến môi trường (.env)
│   └── models/
│       └── models.py                    # Pydantic schemas
```

**Router tổng quan:**

| Prefix | File | Chức năng |
|---|---|---|
| `/ai/chat` | `api/chat.py` | Chat streaming RAG |
| `/ai/predict/title` | `api/predict.py` | Tự sinh tiêu đề phiên chat |
| `/ai/predict/topic` | `api/predict.py` | Phân loại chuyên khoa |
| `/ai/disease` | `api/disease.py` | Embed vector bệnh / thuốc / bác sĩ |

---

## 2. Nền Tảng AI (`config/ai_model.py`)

### Fallback Chain

Khi một model bị giới hạn quota hoặc lỗi, hệ thống tự động thử model kế tiếp:

```
1. gemini-2.5-flash   ← ưu tiên cao nhất
2. gemini-2.0-flash
3. gemini-1.5-flash
4. gemini-1.5-pro     ← dự phòng cuối
```

### Hai Config Riêng Biệt

```python
SHORT_TASK_CONFIG = GenerateContentConfig(
    max_output_tokens=128,   # ~80-100 từ, đủ cho 1 câu phân loại
    temperature=0.0,         # Deterministic — phân loại cần ổn định
    top_p=0.9,
)

CHAT_STREAM_CONFIG = GenerateContentConfig(
    max_output_tokens=1024,  # ~700 từ, tránh stream kéo dài > 100s
    temperature=0.7,
    top_p=0.95,
    system_instruction="Bạn là MediAssist — trợ lý y tế AI chuyên nghiệp. "
                       "Trả lời bằng tiếng Việt, ngắn gọn, chính xác, có cấu trúc. "
                       "Không bịa thông tin y tế. Ưu tiên an toàn người dùng.",
)
```

### Ba Phương Thức Của `AIProvider`

| Phương thức | Dùng cho | API gọi | Config |
|---|---|---|---|
| `generate_short(prompt)` | classify_intent, rewrite_query | `generate_content` (1 lần) | `SHORT_TASK_CONFIG` |
| `generate_chat(prompt)` | Stream câu trả lời chính | `generate_content_stream` | `CHAT_STREAM_CONFIG` |
| `generate_full_text(prompt)` | Sinh title, topic (không stream) | `generate_content` (1 lần) | `CHAT_STREAM_CONFIG` |

**Tại sao tách `generate_short`?**
- `classify_intent` và `rewrite_query` chỉ cần output 1 câu (~20 từ).
- Dùng stream cho những tác vụ này gây overhead không cần thiết (~1-2s mỗi lần).
- `temperature=0.0` giúp kết quả phân loại ổn định, không random.

**Bảo vệ tài nguyên:**
- `generate_chat()` bắt `asyncio.CancelledError` khi user đóng tab → dừng stream ngay, không tiêu hao API key.

---

## 3. Hệ Thống Embedding (`services/embedding_vector_service.py`)

Mô hình: **`keepitreal/vietnamese-sbert`** (SentenceTransformer) — tối ưu cho tiếng Việt.

| Hàm | Đầu vào | Đầu ra |
|---|---|---|
| `embed_user_query(text)` | Câu hỏi người dùng | `list[float]` (vector) |
| `embed_disease_data(...)` | Tên bệnh, mô tả, triệu chứng | `list[dict]` (chunks + vectors) |
| `embed_medicine_data(...)` | Tên thuốc, thành phần, hướng dẫn, tác dụng phụ | `list[dict]` |
| `embed_doctor_data(...)` | Tên bác sĩ, chuyên khoa, kinh nghiệm, học vấn | `list[dict]` |

### Chunking (`services/chunking_service.py`)
- **Chunk size**: 600 ký tự/đoạn.
- **Overlap**: 100 ký tự chồng lấp để giữ ngữ cảnh liên đoạn.
- Ưu tiên cắt tại ranh giới câu (`.`, `!`, `?`) thay vì cắt ngang từ.

---

## 4. Luồng Chat RAG (`/ai/chat`) — Chi Tiết

Hàm chính: `rag_service.build_and_stream(session_id, user_input)`.

```
Client POST /ai/chat
        │
        ▼
[Bước 1] Lấy lịch sử 6 tin nhắn gần nhất từ DB
        │
        ▼
[Bước 2] Song song (asyncio.gather):
        ├── embed_user_query(user_input)   → query_vector
        └── classify_intent(history, input) → intent  [generate_short, 128 tokens]
        │
        ▼
[Bước 3] Truy vấn DB theo intent (song song):
        ├── disease_chunks   (nếu: symptom_inquiry / general_health / emergency)
        ├── medicine_chunks  (nếu: medicine_inquiry)
        └── doctor_chunks + etl_reports (nếu: doctor_search / appointment_booking / emergency)
        │
        ▼
[Bước 4] Xây dựng prompt (Markdown có cấu trúc)
        │
        ▼
[Bước 5] generate_chat(prompt) → stream từng chunk → yield về Client
         (Log first-token latency để monitor hiệu năng)
        │
        ▼
[Bước 6] Lưu full_response vào chat_messages (role = "AI")
```

### Bước 1 — Khôi phục bộ nhớ ngắn hạn
```sql
SELECT role, content FROM chat_messages
WHERE session_id = $1
ORDER BY created_at DESC LIMIT 6
```
Lấy 6 tin nhắn gần nhất, đảo ngược để ra thứ tự tự nhiên. Giới hạn 400 ký tự/tin nhắn để không làm phồng prompt.

### Bước 2 — Embed + Intent (song song)

**`classify_intent`** — dùng `generate_short` (không stream, 128 tokens, temperature=0.0):

| Intent | Mô tả |
|---|---|
| `symptom_inquiry` | Hỏi triệu chứng, nguyên nhân bệnh |
| `medicine_inquiry` | Hỏi thuốc, tác dụng phụ, cách dùng |
| `doctor_search` | Tìm bác sĩ, chuyên khoa |
| `appointment_booking` | Đặt lịch khám |
| `general_health` | Tư vấn sức khỏe tổng quát |
| `emergency` | Tình huống khẩn cấp |

Nếu LLM trả về nhãn không hợp lệ hoặc lỗi → fallback về `general_health`.

### Bước 3 — Hybrid Vector Search

```sql
-- Ví dụ disease_chunks
SELECT d.name, dc.content, (1 - (dc.embedding <=> $1::vector)) as score
FROM disease_chunks dc JOIN diseases d ON dc.disease_id = d.id
WHERE (1 - (dc.embedding <=> $1::vector)) > 0.4   -- cosine similarity threshold
   OR $2 ILIKE '%' || d.name || '%'                -- keyword match trực tiếp
ORDER BY
   (CASE WHEN $2 ILIKE '%' || d.name || '%' THEN 1 ELSE 0 END) DESC,
   dc.embedding <=> $1::vector
LIMIT 3
```

- **Vector search**: pgvector + Cosine Similarity, ngưỡng `> 0.4`.
- **Keyword fallback**: nếu tên bệnh/thuốc/bác sĩ xuất hiện rõ trong câu hỏi → ưu tiên lên đầu.
- Top 3 kết quả cho mỗi loại.
- Với `doctor_search`/`appointment_booking`: truy vấn thêm `etl_reports` (`top_doctors`) để gợi ý bác sĩ nổi bật.

### Bước 4 — Xây dựng Prompt

Prompt được cấu trúc dạng Markdown rõ ràng để AI dễ parse:

```
## Ngữ cảnh
Bệnh: ...
Thuốc: ...
Bác sĩ (Phù hợp): [ID] [Avatar] Tên (Chuyên khoa) ...
Gợi ý hệ thống (Top Bác sĩ): [...]

## Lịch sử hội thoại
Người dùng: ...
Trợ lý: ...

## Câu hỏi
...

## Yêu cầu
- Trả lời ngắn gọn, chính xác, hữu ích.
- Ưu tiên "Bác sĩ (Phù hợp)" khi tìm bác sĩ/đặt lịch.
- Nếu nhắc đến bác sĩ: BẮT BUỘC thêm thẻ
  [DOCTOR_CARD id="..." name="..." specialty="..." avatar="..."]
```

`system_instruction` ("Bạn là MediAssist…") được truyền qua `CHAT_STREAM_CONFIG` thay vì lặp trong mỗi prompt → ít token hơn, AI xử lý nhanh hơn.

### Bước 5 — Stream & Monitor

```python
first_token_time = None
async for chunk in ai_provider.generate_chat(prompt):
    if first_token_time is None:
        first_token_time = time.time()
        print(f"[RAG] First token latency: {first_token_time - t_stream:.2f}s")
    full_response += chunk
    yield chunk
```

- `max_output_tokens=1024` đảm bảo stream kết thúc trong **5-15s** thay vì >100s.
- Log **first-token latency** để monitor độ trễ thực tế từ khi gọi Gemini đến khi user nhận chunk đầu tiên.

### Bước 6 — Lưu phản hồi

```sql
INSERT INTO chat_messages (id, session_id, role, content)
VALUES ($1, $2, 'AI', $3)
```

---

## 5. Luồng Dự Đoán Metadata (`/ai/predict`)

### A. Sinh Tiêu Đề (`POST /ai/predict/title`)
1. Nhận `first_message` từ request body.
2. Gửi prompt tới `generate_full_text()`: *"Tóm tắt thành tiêu đề tối đa 6 từ"*.
3. Fallback thủ công nếu lỗi: cắt 6 từ đầu + `...`.
4. Trả về `{ title: "..." }`.

> Backend NestJS chịu trách nhiệm gọi và lưu kết quả — endpoint này **không tự lưu DB**.

### B. Phân Loại Chuyên Khoa (`POST /ai/predict/topic`)
1. Lấy toàn bộ lịch sử chat của `session_id` từ DB.
2. Ghép nội dung → embed thành **vector lịch sử**.
3. Lấy danh sách chuyên khoa từ bảng `specialties`.
4. Embed từng chuyên khoa (tên + mô tả).
5. Tính Cosine Similarity giữa vector lịch sử và từng chuyên khoa.
6. Chọn chuyên khoa có score cao nhất. Nếu `max_score < 0.1` → fallback *"Nội tổng quát"*.
7. Cập nhật `chat_sessions.topic` trong DB.

---

## 6. Luồng Tạo Vector Dữ Liệu Y Tế (`/ai/disease`)

Gọi bởi Admin/Backend để nhúng dữ liệu mới vào knowledge base:

| Endpoint | Dữ liệu đầu vào | Bảng lưu |
|---|---|---|
| `POST /ai/disease` | Tên bệnh, mô tả, triệu chứng | `disease_chunks` |
| `POST /ai/disease/medicine` | Tên thuốc, thành phần, hướng dẫn, tác dụng phụ | `medicine_chunks` |
| `POST /ai/disease/doctor` | Tên bác sĩ, chuyên khoa, kinh nghiệm, học vấn | `doctor_chunks` |

**Quy trình:**
1. Ghép các trường thành văn bản đầy đủ.
2. Chia nhỏ thành chunks (`ChunkingService`).
3. Embed từng chunk → vector (`EmbeddingService`).
4. Trả về danh sách `{ chunk, vector }` cho backend lưu DB.

---

## 7. Sơ Đồ Kiến Trúc RAG Tổng Thể

```
┌──────────────────────────────────────────────────────────────────┐
│                         User Input                               │
└───────────────────────────┬──────────────────────────────────────┘
                            │
          ┌─────────────────┴─────────────────┐
          │         asyncio.gather            │
          ▼                                   ▼
  embed_user_query()               classify_intent()
  [SentenceTransformer]            [generate_short — 128 tokens
                                    temperature=0.0]
          └─────────────────┬─────────────────┘
                            │ intent + query_vector
         ┌──────────────────┼──────────────────┐
         ▼                  ▼                  ▼
  Disease Search      Medicine Search    Doctor Search
  (pgvector +         (pgvector +        (pgvector +
   keyword ILIKE)      keyword ILIKE)     keyword ILIKE
                                         + ETL Reports)
         └──────────────────┬──────────────────┘
                            │ context_text
              ┌─────────────▼──────────────┐
              │     Prompt Construction    │
              │  ## Ngữ cảnh              │
              │  ## Lịch sử hội thoại     │
              │  ## Câu hỏi               │
              │  ## Yêu cầu               │
              └─────────────┬──────────────┘
                            │
              ┌─────────────▼──────────────┐
              │  generate_chat(prompt)     │
              │  [CHAT_STREAM_CONFIG       │
              │   max_output_tokens=1024   │
              │   system_instruction=...]  │
              └─────────────┬──────────────┘
                            │ stream chunks
              ┌─────────────▼──────────────┐
              │   StreamingResponse        │  → text/event-stream → Client
              │   (log first-token time)   │
              └─────────────┬──────────────┘
                            │ full_response
              ┌─────────────▼──────────────┐
              │  INSERT chat_messages      │  → PostgreSQL
              └────────────────────────────┘
```

---

## 8. Tóm Tắt Các Tối Ưu Hiệu Năng

| Kỹ thuật | Lợi ích |
|---|---|
| `asyncio.gather` cho embed + intent | Tiết kiệm ~1-2s mỗi request |
| `generate_short` cho tác vụ ngắn | Không overhead stream, 128 tokens, temperature=0 |
| `max_output_tokens=1024` cho stream | Stream kết thúc trong 5-15s thay vì >100s |
| `system_instruction` trong config | Giảm token lặp lại trong mỗi prompt |
| Hybrid search (vector + keyword) | Tăng recall khi tên bệnh/bác sĩ rõ ràng |
| Intent routing | Chỉ query bảng liên quan, giảm nhiễu context |
| First-token latency logging | Monitor thực tế từng request |
| `CancelledError` handling | Dừng stream ngay khi user ngắt kết nối |
