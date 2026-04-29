<p align="center">
  <img src="frontend/public/images/logo.png" alt="MediCare Logo" width="80" />
</p>

<h1 align="center">K-Hospital — MediCare 🏥</h1>

<p align="center">
  <b>Nền tảng quản lý lịch khám bệnh trực tuyến thông minh</b><br/>
  Tích hợp AI Chatbot tư vấn sức khỏe & hệ thống phân tích dữ liệu y tế thời gian thực,<br/>
  giúp tối ưu hóa quy trình tiếp nhận bệnh nhân và giảm thiểu thời gian chờ đợi.
</p>

<p align="center">
  <a href="https://github.com/trieu123x/k-hospital/actions">
    <img src="https://github.com/trieu123x/k-hospital/actions/workflows/cicd.yml/badge.svg" alt="CI Status" />
  </a>
  <img src="https://img.shields.io/badge/license-ISC-blue.svg" alt="License" />
  <img src="https://img.shields.io/badge/node-%3E%3D22-brightgreen.svg" alt="Node" />
  <img src="https://img.shields.io/badge/python-3.12-blue.svg" alt="Python" />
</p>

---

## 📸 Demo trực quan

> **Live Demo:** [https://k-hospital.vercel.app](https://k-hospital.vercel.app) _(Frontend)_ · [https://k-hospital.up.railway.app](https://k-hospital.up.railway.app) _(Backend API)_

<!-- Thêm screenshot hoặc GIF demo vào đây -->
<!--
![Trang chủ](docs/screenshots/home.png)
![Đặt lịch khám](docs/screenshots/booking-flow.gif)
![AI Chatbot](docs/screenshots/chatbot.png)
![Admin Dashboard](docs/screenshots/admin-dashboard.png)
-->

| Trang chủ | Đặt lịch khám | AI Chatbot | Admin Dashboard |
|:---------:|:-------------:|:----------:|:---------------:|
| 🏠 Landing page với giới thiệu dịch vụ | 📅 Chọn bác sĩ, chuyên khoa & ca khám | 🤖 Chat streaming như ChatGPT | 📊 Thống kê & quản lý toàn diện |

---

## 🎯 Vấn đề & Giải pháp

### ❌ Vấn đề (Problem)

Hệ thống y tế truyền thống tại Việt Nam đang gặp nhiều khó khăn:

- **Xếp hàng chờ đợi lâu:** Bệnh nhân phải đến trực tiếp bệnh viện từ sáng sớm để lấy số thứ tự.
- **Quản lý hồ sơ cồng kềnh:** Hồ sơ bệnh án giấy tờ dễ thất lạc, khó tra cứu lịch sử khám bệnh.
- **Thiếu kênh tư vấn ban đầu:** Bệnh nhân không biết nên khám chuyên khoa nào, dẫn đến khám sai khoa, mất thời gian.
- **Thiếu dữ liệu phân tích:** Bệnh viện khó đưa ra quyết định dựa trên dữ liệu khi không có hệ thống tracking hành vi.

### ✅ Giải pháp (Solution)

**MediCare** là nền tảng số hóa toàn diện, giải quyết trọn vẹn các nỗi đau trên:

- 🔄 **Đặt lịch trực tuyến:** Bệnh nhân chủ động chọn bác sĩ, chuyên khoa, ngày giờ — không cần xếp hàng.
- 📋 **Bệnh án điện tử:** Bác sĩ ghi nhận chẩn đoán, đơn thuốc trực tiếp trên hệ thống — bệnh nhân tra cứu mọi lúc.
- 🤖 **AI Chatbot tư vấn (RAG + Gemini):** Trợ lý ảo phân tích triệu chứng, gợi ý chuyên khoa phù hợp trước khi đặt lịch.
- 📊 **ETL Data Pipeline:** Hệ thống thu thập sự kiện người dùng, phân tích hành vi và tạo báo cáo tự động phục vụ ra quyết định.

---

## ✨ Tính năng nổi bật (Key Features)

### 👥 Phân quyền người dùng (RBAC)
- **Bệnh nhân:** Đặt/hủy lịch, xem bệnh án, chat AI, tra cứu bệnh & thuốc.
- **Bác sĩ:** Quản lý lịch khám, ghi bệnh án điện tử, đăng ký lịch nghỉ.
- **Admin:** CRUD toàn bộ dữ liệu (người dùng, bệnh, thuốc, tin tức), Dashboard phân tích.

### 🤖 AI Chatbot thông minh (RAG Architecture)
- Chat streaming thời gian thực (Server-Sent Events) — trải nghiệm như ChatGPT.
- **RAG (Retrieval-Augmented Generation):** Truy xuất Top 3 bệnh liên quan bằng `pgvector` Cosine Similarity, kết hợp context bác sĩ gợi ý.
- Tự động dự đoán **Tiêu đề** và **Chuyên khoa** cho mỗi phiên chat bằng Gemini.
- Cơ chế an toàn: Tự hủy luồng sinh text khi client ngắt kết nối — tiết kiệm chi phí API.

### 📅 Hệ thống đặt lịch khám
- Chọn bác sĩ theo chuyên khoa, học vị, kinh nghiệm.
- Hỗ trợ đặt lịch theo ca (shift-based scheduling).
- Email xác nhận tự động qua **Resend + Nodemailer**.
- Thông báo trạng thái lịch hẹn real-time (Pending → Confirmed → Completed).

### 📊 ETL Data Pipeline & Analytics
- Thu thập sự kiện người dùng (xem bác sĩ, đặt lịch, chat AI...).
- Pipeline **Extract → Transform → Load** với DuckDB + Parquet.
- Báo cáo tự động: Top bác sĩ, Top bệnh, Ca khám cao điểm, Tổng hợp ngày.
- Hỗ trợ chạy scheduled hoặc theo ngày tùy chỉnh.

### 🔐 Bảo mật & Xác thực
- Xác thực JWT (Bearer Token) + Cookie dual-layer.
- Mã hóa mật khẩu bằng **bcrypt**.
- Validation dữ liệu với **Zod** schema.
- Middleware phân quyền bảo vệ API endpoint.

### 📖 Tra cứu Y khoa
- Từ điển **Bệnh** với phân loại theo danh mục & chuyên khoa, triệu chứng, cách điều trị tại nhà.
- Từ điển **Thuốc** với thành phần, liều dùng, hướng dẫn sử dụng, tác dụng phụ.
- Tìm kiếm Fuzzy Search (Trigram Index `pg_trgm`).

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

### Frontend
![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js_22-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

### AI Service
![Python](https://img.shields.io/badge/Python_3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)

### Database & Infrastructure
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![pgvector](https://img.shields.io/badge/pgvector-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![DuckDB](https://img.shields.io/badge/DuckDB-FFF000?style=for-the-badge&logo=duckdb&logoColor=black)

### DevOps & Tools
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)

---

## 📁 Cấu trúc thư mục (Folder Structure)

```
k-hospital/
├── frontend/                    # 🖥️ Next.js 16 (React 19)
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   │   ├── admin/           # Admin panel (CRUD bệnh, thuốc, tin tức, users)
│   │   │   ├── appointment/     # Đặt lịch khám
│   │   │   ├── doctors/         # Danh sách & chi tiết bác sĩ
│   │   │   ├── diseases/        # Tra cứu bệnh
│   │   │   ├── medicines/       # Tra cứu thuốc
│   │   │   ├── news/            # Tin tức y tế
│   │   │   ├── profile/         # Hồ sơ cá nhân & lịch sử khám
│   │   │   └── login/           # Xác thực người dùng
│   │   ├── components/          # UI components tái sử dụng
│   │   │   ├── chat/            # AI Chatbot widget
│   │   │   ├── layout/          # Navbar, Footer, Sidebar
│   │   │   ├── admin/           # Components cho trang quản trị
│   │   │   └── ui/              # Shared UI elements
│   │   ├── routers/             # API client (Axios interceptors)
│   │   └── stores/              # Zustand state management
│   └── public/                  # Static assets
│
├── backend/                     # ⚙️ Express 5 + Prisma 7
│   ├── src/
│   │   ├── controllers/         # Request handlers
│   │   ├── services/            # Business logic layer
│   │   ├── repositories/        # Data access layer (Prisma)
│   │   ├── routers/             # API route definitions
│   │   ├── middlewares/         # Auth, validation, error handling
│   │   ├── validates/           # Zod schemas
│   │   ├── helpers/             # Utilities
│   │   ├── configs/             # App configuration
│   │   └── docs/                # Swagger/OpenAPI specs
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema (16 models)
│   │   └── seed.js              # Seed data
│   └── test/                    # Unit tests (Vitest)
│
├── ai/                          # 🤖 FastAPI (Python 3.12)
│   └── app/
│       ├── api/                 # Endpoints (chat, predict, disease)
│       ├── services/            # RAG, Embedding, Prediction
│       ├── config/              # AI Provider (Google Gemini)
│       └── models/              # Data models
│
├── analysis/                    # 📊 ETL Data Pipeline
│   └── src/
│       ├── extract/             # Data extraction from PostgreSQL
│       ├── transform/           # Data transformation logic
│       ├── load/                # Load to DuckDB + Parquet
│       ├── pipeline/            # Pipeline orchestration
│       └── helpers/             # Utility functions
│
└── .github/workflows/           # 🔄 CI/CD (GitHub Actions)
```

---

## 🚀 Hướng dẫn cài đặt (Getting Started)

### Yêu cầu hệ thống
- **Node.js** ≥ 22 · **Python** ≥ 3.12 · **PostgreSQL** (hoặc Supabase)

### 1. Clone dự án

```bash
git clone https://github.com/trieu123x/k-hospital.git
cd k-hospital
```

### 2. Cài đặt Backend

```bash
cd backend
npm install
```

Tạo file `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/medicare"
SUPABASE_URL="your_supabase_url"
SUPABASE_KEY="your_supabase_key"
JWT_SECRET="your_jwt_secret"
RESEND_API_KEY="your_resend_key"
```

Chạy migration & seed dữ liệu:

```bash
npx prisma migrate dev
npx prisma db seed
npm run dev                  # → http://localhost:3001
```

### 3. Cài đặt Frontend

```bash
cd frontend
npm install
```

Tạo file `.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
```

```bash
npm run dev                  # → http://localhost:3000
```

### 4. Cài đặt AI Service

```bash
cd ai
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
```

Tạo file `.env`:

```env
GEMINI_API_KEY="your_gemini_api_key"
DATABASE_URL="your_database_url"
```

```bash
uvicorn app.main:app --reload --port 8000   # → http://localhost:8000
```

### 5. Chạy ETL Pipeline (Tùy chọn)

```bash
cd analysis
npm install
npm run etl                  # Chạy pipeline một lần
npm run etl:schedule         # Chạy theo lịch (cron)
```

---

## 🧑‍💻 API Documentation

Backend API được tài liệu hóa bằng **Swagger/OpenAPI**. Sau khi chạy backend:

```
http://localhost:3001/api-docs
```

---

## 🧪 Testing

```bash
# Backend unit tests (Vitest)
cd backend
npm run test
```

CI/CD tự động chạy test trên mọi push/PR qua **GitHub Actions**.

---

## 💡 Bài học rút ra & Hướng phát triển

### 🔍 Bài học rút ra (Lessons Learned)

| Thách thức | Cách giải quyết |
|:-----------|:---------------|
| **Cross-domain Auth (Vercel ↔ Railway)** | Cookie bị chặn bởi SameSite policy → Triển khai dual-layer auth (Cookie + Bearer Token), Frontend lưu token vào localStorage và gắn vào header Authorization. |
| **N+1 Query với Prisma** | Sử dụng `include` và `select` hợp lý, thiết kế Repository layer riêng biệt để kiểm soát query. |
| **Streaming response từ AI** | Kết hợp Server-Sent Events (FastAPI `StreamingResponse`) + `EventSource` API ở Frontend. Xử lý edge case khi client ngắt kết nối giữa chừng bằng `asyncio.CancelledError`. |
| **Vector Search hiệu năng** | Sử dụng extension `pgvector` trên PostgreSQL thay vì dựng thêm vector DB riêng → giảm chi phí infra, tận dụng index `ivfflat` cho tìm kiếm nhanh. |
| **ETL cho dữ liệu lớn** | Chọn DuckDB (in-process OLAP) + Parquet format thay vì xử lý trực tiếp trên PostgreSQL → tách biệt workload OLTP vs OLAP. |

### 🔮 Hướng phát triển (Future Plans)

- [ ] 🔔 **Real-time Notifications** — Tích hợp WebSocket/SSE cho thông báo tức thời.
- [ ] 💳 **Thanh toán trực tuyến** — Tích hợp VNPay/MoMo cho thanh toán phí khám.
- [ ] 📱 **Responsive Mobile App** — Phát triển React Native app cho iOS/Android.
- [ ] 🧠 **Nâng cấp AI** — Fine-tune model cho domain y tế Việt Nam, thêm phân tích hình ảnh y khoa.
- [ ] 📈 **Advanced Analytics** — Dashboard phân tích dự đoán xu hướng bệnh theo mùa.
- [ ] 🌐 **Đa ngôn ngữ (i18n)** — Hỗ trợ tiếng Anh cho bệnh nhân quốc tế.

---

## 👨‍👩‍👦 Nhóm phát triển

Dự án được phát triển bởi nhóm sinh viên (3 người) trong khuôn khổ môn học tại trường đại học.

---

<p align="center">
  <sub>Made with ❤️ by K-Hospital Team</sub>
</p>
