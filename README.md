<h1 align="center">MediCare (K-Hospital)</h1>

<p align="center">
  <b>Hệ thống quản lý bệnh viện & Trợ lý Y tế AI Thông minh</b><br/>
  Nền tảng chuyển đổi số toàn diện tích hợp RAG Chatbot và ETL Analytics.
</p>

## 1. Giới thiệu

**MediCare (K-Hospital)** là một website bệnh viện hỗ trợ người dùng tìm hiểu các thông tin về thuốc, bệnh, cập nhật tin tức, chủ động đặt lịch khám, quản lý các thông tin liên quan. Bác sĩ dễ dàng quản lý thời gian làm việc, các yêu cầu khám bệnh. Admin cũng có thể sử dụng để xem dashboard báo cáo cơ bản, quản lý thông tin user, bệnh, tin tức, thuốc men của bệnh viện

Hệ thống kết nối trực tiếp Bệnh nhân và Bác sĩ thông qua một quy trình khám chữa bệnh tinh gọn, từ khâu tư vấn ban đầu (qua AI), đặt lịch, đến quản lý bệnh án điện tử.

## 2. Hình ảnh Demo

> [!NOTE]
> **Lưu ý: Các hình ảnh dưới đây chỉ mang tính chất demo một phần các tính năng của hệ thống.**

### Dành cho Bệnh nhân (Patient)
Hỗ trợ tìm hiểu thông tin, đặt lịch và theo dõi sức khỏe chủ động.

<div align="center">
  <img src="ui%20screen/Giao%20diện%20sảnh.png" width="48%" alt="Giao diện sảnh" />
  <img src="ui%20screen/List%20bác%20sĩ.png" width="48%" alt="Danh sách bác sĩ" />
</div>

<div align="center">
  <img src="ui%20screen/List%20bệnh.png" width="48%" alt="Danh sách bệnh" />
  <img src="ui%20screen/Chi%20tiết%20thuốc.png" width="48%" alt="Chi tiết thuốc" />
</div>

<div align="center">
  <img src="ui%20screen/Chi%20tiết%20bài%20báo.png" width="48%" alt="Chi tiết bài báo" />
  <img src="ui%20screen/Đặt%20lịch%20khám.png" width="48%" alt="Đặt lịch khám" />
</div>

<div align="center">
  <img src="ui%20screen/Lịch%20thăm%20khám%20sắp%20diễn%20ra%20của%20bệnh%20nhân.png" width="48%" alt="Lịch thăm khám" />
  <img src="ui%20screen/Quản%20lý%20lịch%20sử%20khám.png" width="48%" alt="Lịch sử khám" />
</div>

<div align="center">
  <img src="ui%20screen/Chatbot1.png" width="48%" alt="Trợ lý AI 1" />
  <img src="ui%20screen/Chatbot2.png" width="48%" alt="Trợ lý AI 2" />
</div>

### Dành cho Bác sĩ (Doctor)
Quản lý lịch làm việc, tiếp nhận yêu cầu khám dễ dàng.

<div align="center">
  <img src="ui%20screen/bác%20sĩ%20quản%20lý%20yêu%20cầu%20của%20bệnh%20nhân.png" width="48%" alt="Quản lý yêu cầu bệnh nhân" />
  <img src="ui%20screen/Yêu%20cầu%20khám%20chưa%20hoàn%20tất%20xác%20nhận%20của%20bác%20sĩ.png" width="48%" alt="Yêu cầu khám chưa xác nhận" />
</div>

<div align="center">
  <img src="ui%20screen/Quản%20lý%20lịch%20làm%20việc%20của%20bác%20sĩ.png" width="48%" alt="Quản lý lịch làm việc" />
</div>

### Dành cho Quản trị viên (Admin)
Dashboard tổng quan và hệ thống quản lý.

<div align="center">
  <img src="ui%20screen/Dashboard%20admin.png" width="48%" alt="Dashboard Admin" />
  <img src="ui%20screen/Giao%20diện%20quản%20lý%20của%20admin.png" width="48%" alt="Quản lý danh mục" />
</div>

<div align="center">
  <img src="ui%20screen/Giao%20diện%20tạo%20của%20admin.png" width="48%" alt="Tạo mới nội dung" />
</div>

---

## 3. Tính năng chi tiết

Hệ thống được thiết kế linh hoạt, bảo mật và phân quyền rõ ràng phục vụ cho 3 nhóm đối tượng chính (Role-Based Access Control - RBAC):

### Bệnh nhân (Patient)
- **Đặt lịch trực tuyến thông minh:** 
  - Tìm kiếm và đặt lịch khám theo bác sĩ, chuyên khoa, ngày và ca khám cụ thể. 
  - Hệ thống tự động kiểm tra và cảnh báo nếu bệnh nhân đã có lịch hẹn trước đó với cùng bác sĩ, đồng thời hỗ trợ tùy chọn xác nhận ghi đè lên lịch cũ.
  - Tự động loại bỏ các ca khám mà bác sĩ đã đăng ký báo bận/nghỉ phép.
  - Hỗ trợ hủy lịch đã yêu cầu trước 24 giờ.
- **Trợ lý Y tế AI (Chatbot):**
  - Tích hợp mô hình RAG (Retrieval-Augmented Generation).
  - Phân tích triệu chứng và đề xuất chính xác chuyên khoa/bác sĩ, loại thuốc phù hợp (tích hợp thẻ thông tin bác sĩ ngay trong khung chat).
  - Trải nghiệm phản hồi tự nhiên, hiển thị từng đoạn thông qua Server-Sent Events.
  - Tự động tóm tắt ngữ cảnh để đặt Tiêu đề và phân loại Chủ đề (Topic) cho đoạn chat.
- **Từ điển Tra cứu Y khoa:** 
  - **Bệnh lý:** Cung cấp thông tin chi tiết, triệu chứng và cách điều trị tại nhà.
  - **Thuốc:** Tra cứu thành phần, liều lượng, tác dụng phụ và cách dùng.
  - Tối ưu trải nghiệm với công nghệ tìm kiếm (Fuzzy Search).
- **Quản lý Hồ sơ & Bệnh án:** 
  - Theo dõi trạng thái lịch khám.
  - Tra cứu lại lịch sử khám, chẩn đoán của bác sĩ và đơn thuốc điện tử ở các lần khám trước.
- **Tin tức & Thông báo:** 
  - Cập nhật và đọc các bài viết, tin tức y khoa từ hệ thống.
  - Nhận thông báo tự động mỗi khi lịch khám được xác nhận hoặc bị hủy.

### Bác sĩ (Doctor)
- **Quản lý lịch khám bệnh:** 
  - Xem danh sách và theo dõi chi tiết các ca đặt lịch khám bệnh.
  - Tiếp nhận và xử lý các yêu cầu đặt lịch bằng cách phê duyệt để lên lịch khám hoặc từ chối/hủy.
- **Bệnh án điện tử (EMR):** 
  - Sau mỗi ca khám, bác sĩ có thể trực tiếp ghi chú chẩn đoán, kê đơn thuốc và dặn dò vào hệ thống. Lịch khám sẽ tự động chuyển sang trạng thái hoàn thành.
- **Quản lý lịch làm việc (Báo bận):** 
  - Bác sĩ có thể chủ động đăng ký các ca nghỉ/báo bận. 
  - Yêu cầu báo bận phải được thực hiện trước 24 tiếng so với ca khám. Hệ thống tự động khóa các ca này ở phía bệnh nhân.
- **Hệ thống Thông báo:** 
  - Tự động nhận thông báo khi có bệnh nhân gửi yêu cầu đặt lịch mới hoặc hủy lịch hẹn.

### Quản trị viên (Admin)
- **Quản trị Nội dung & Danh mục (CRUD):** 
  - Quản lý toàn diện dữ liệu: Người dùng, Bác sĩ, Bệnh lý, Thuốc
  - Quản trị Cổng thông tin: Cập nhật Tin tức y tế.
- **Hệ thống Phân tích Dữ liệu (Data Analytics - ETL):** 
  - Hệ thống ngầm tracking các sự kiện (User Events) như: Lượt xem bác sĩ, Lượt tra bệnh, Tần suất đặt lịch.
  - Tích hợp Pipeline ETL chuyên sâu với DuckDB trích xuất ra các báo cáo thông minh:
    - Báo cáo *Top Bác sĩ* được quan tâm nhất.
    - Báo cáo *Top Bệnh lý* được tra cứu nhiều nhất.
    - Phân tích *Khung giờ cao điểm* (Peak Shifts) để phân bổ nhân sự.
    - Tổng hợp lượng người dùng và các chủ đề bệnh đang được quan tâm thông qua hội thoại với .

---

## 4. Kiến trúc hệ thống 

```mermaid
graph TD
    %% Tầng Frontend
    Client[Next.js Client]

    %% Tầng Core Services
    Backend[Express.js API]
    AI[FastAPI AI Service]

    %% Tầng Database & Auth
    Auth[Supabase Auth]
    DB[(PostgreSQL + pgvector)]

    %% Tầng Analytics & Storage
    ETL[DuckDB ETL Pipeline]
    Storage[(Supabase Storage)]

    %% Các luồng giao tiếp (Sắp xếp theo thứ tự ưu tiên layout)
    Client -->|REST API| Backend
    Client -->|SSE Streaming| AI
    
    Backend -.->|Auth & OTP Email| Auth
    Backend -->|Prisma ORM| DB
    
    AI -->|Vector Search| DB
    
    DB -.->|Extract Data| ETL
    ETL -.->|Upload Parquet| Storage
    
    Client -.->|Read Media| Storage
```

---

## 5. Phần công nghệ sử dụng (The Tech Stack)

| Lớp (Layer) | Công nghệ chính | Chức năng |
|:---|:---|:---|
| **Frontend** | Next.js 16 (App Router), TailwindCSS 4, Zustand | Giao diện người dùng, State management, Routing |
| **Backend Core** | Node.js 22, Express.js 5, Prisma ORM | API Server, Auth (JWT + HttpOnly Cookie), Business Logic |
| **AI Service** | Python 3.12, FastAPI, Google Gemini API | Xử lý RAG, Vector Embedding, Chat Streaming |
| **Data & DB** | PostgreSQL, `pgvector`, `pg_trgm`, DuckDB | Lưu trữ chính, Vector search, Fuzzy search, In-memory OLAP (ETL) |
| **DevOps** | GitHub Actions, Vercel, Railway, Supabase | CI/CD Pipeline, Hosting, Database Cloud |
| **Khác** | Zod, Vitest | Data Validation, Unit Testinge |

---

## 6. Hướng dẫn cài đặt & Triển khai (The Execution)

### Yêu cầu tiên quyết
- **Node.js** (v22+)
- **Python** (v3.12+)
- **PostgreSQL** có cài đặt sẵn extension `pgvector` và `pg_trgm` (Khuyến nghị dùng Supabase).

### Bước 1: Clone Repository
```bash
git clone https://github.com/trieu123x/k-hospital.git
cd k-hospital
```

### Bước 2: Khởi chạy Backend (Core API)
```bash
cd backend
npm install

# Push schema và seed dữ liệu mẫu
npx prisma db push
npx prisma db seed

# Chạy server (Port 5000)
npm run dev
```

### Bước 3: Khởi chạy AI Service
```bash
cd ai
python -m venv venv
# Active venv (Windows)
venv\Scripts\activate
# Active venv (Mac/Linux)
# source venv/bin/activate

pip install -r requirements.txt

# Chạy server (Port 8000)
uvicorn app.main:app --reload --port 8000
```

### Bước 4: Khởi chạy Frontend
```bash
cd frontend
npm install

# 1. Chạy ở chế độ phát triển (Development - Port 3000)
npm run dev

# 2. Build và chạy ở chế độ Production (Tối ưu hóa hiệu suất)
npm run build
npm start
```

### Bước 5: Chạy Data Pipeline (Tùy chọn)
```bash
cd analysis
npm install

# Chạy pipeline thủ công
npm run etl

# Hoặc chạy theo lịch trình (cron)
npm run etl:schedule
```
  
---

## 7. Cấu hình Environment (Environment Variables)

Hệ thống yêu cầu thiết lập các biến môi trường tại các thư mục tương ứng.

### `backend/.env`
```env
# Kết nối DB thông qua PgBouncer (Pooling)
DATABASE_URL="postgresql://user:pass@host:6543/db?pgbouncer=true"
# Kết nối DB trực tiếp (cho Prisma Migrate)
DIRECT_URL="postgresql://user:pass@host:5432/db"

SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role"

PORT="5000"
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_app_password"
```

### `frontend/.env.local`
```env
NEXT_PUBLIC_API_URL="http://localhost:5000"
NEXT_PUBLIC_AI_API_URL="http://localhost:8000"
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
```

### `ai/.env`
```env
PROJECT_NAME="MediCare AI Service"
API_V1_STR="/ai"
GEMINI_API_KEY="your_gemini_api_key"
DATABASE_URL="postgresql://user:pass@host:6543/db?pgbouncer=true"
```

### `analysis/.env`
```env
# DuckDB cần kết nối trực tiếp (Port 5432, không qua PgBouncer)
DATABASE_URL="postgresql://user:pass@host:5432/db"
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_KEY="your_supabase_service_role"
```

---

> [!TIP]
> Hệ thống CI/CD đã được thiết lập sẵn trong thư mục `.github/workflows/cicd.yml`. Mỗi khi push code lên nhánh `main`, `dev`, hệ thống sẽ tự động chạy Vitest và kiểm tra Prisma schema.

<p align="center">
  <sub>Made with ❤️ by Medicare Team</sub>
</p>
