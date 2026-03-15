# QUY TRÌNH QUẢN LÝ DATABASE VỚI PRISMA

Tài liệu này hướng dẫn các thành viên trong nhóm cách cập nhật và đồng bộ cấu trúc Database của dự án Medicare.

---

## A. Các bước thay đổi cấu trúc, logic database
*Áp dụng khi cần thêm bảng mới, thêm cột, hoặc thay đổi quan hệ giữa các bảng trong database.*

1. **Chỉnh sửa:** Mở file `prisma/schema.prisma` và thực hiện thay đổi logic database.
2. **Tạo và thực thi Migration:** Chạy lệnh sau trong terminal:
   ```bash
   npx prisma migrate dev --name <ten_mo_ta_thay_doi>
3. **Trong trường hợp chưa muốn nó thực thi ngay:** Chạy lệnh sau trong terminal:
   ```bash
   npx prisma migrate dev --create-only --name <ten_mo_ta_thay_doi>


## B. Các bước cập nhật sự thay đổi cho mọi người
*Áp dụng khi thấy có sự thay đổi trong file `schema.prisma`  sau khi Git Pull.*

1. **Cập nhật Database Local:** Chạy lệnh sau để Prisma tự động quét các sự thay đổi và áp dụng vào Database của bạn:
   ```bash
   npx prisma migrate dev



## C. Các bước sinh mã nguồn prisma phục vụ cho code sau khi thay đổi/ tạo mới database (BẮT BUỘC)
*Áp dụng sau khi đã thực thi lệnh migrate.*
1. **Sinh mã nguồn code prisma:** Chạy lệnh sau để hoàn thiện lại mã nguồn phù hợp với cấu trúc database mới:
   ```bash
   npx prisma generate



## D. Cơ chế reset toàn bộ (Khi cần làm sạch hoặc đập đi xây lại)
*Áp dụng khi database gặp lỗi cấu trúc, chứa nhiều dữ liệu rác, hoặc muốn chạy lại toàn bộ từ đầu.*

1. **Reset toàn bộ (Xóa bảng, chạy lại Migrate & Seed):**
   Lệnh này sẽ xóa sạch toàn bộ database, sau đó chạy lại các file migration từ đầu và file `seed.js` để nạp dữ liệu mẫu.
   
   ```bash
   npx prisma migrate reset



## E. Cơ chế reset nhanh (Chỉ xóa dữ liệu có trong db)
*Áp dụng khi chỉ muốn reset dữ liệu lưu trong các bảng database.*

1. **Reset dữ liệu:**
   Lệnh này sẽ xóa sạch toàn bộ database nhưng giữ lại kiến trúc của các bảng có trong database
   
   ```bash
   npx prisma db push --force-reset



## F. Cách chạy file seed:
*Áp dụng để thêm dữ liệu vào database(logic seed nằm trong file `/backend/prisma/seed.js`).*

1. **Gõ lệnh sau trong domain backend:**
   Lệnh này sẽ xóa sạch toàn bộ database nhưng giữ lại kiến trúc của các bảng có trong database
   
   ```bash
   npx prisma db seed




