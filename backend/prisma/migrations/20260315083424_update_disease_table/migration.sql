-- Kích hoạt Extension
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS vector;

-- Thêm cột name_clean (Prisma có thể đã gen dòng này, nếu có rồi thì thôi)
ALTER TABLE "diseases" ADD COLUMN IF NOT EXISTS "name_clean" TEXT;

-- Tạo hàm tự động xóa dấu và chuyển thành chữ thường
CREATE OR REPLACE FUNCTION sync_disease_name_clean() 
RETURNS trigger AS $$
BEGIN
  -- Hàm unaccent() có sẵn của Postgres sẽ xử lý việc xóa dấu
  NEW.name_clean := lower(unaccent(NEW.name));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tạo Trigger: Mỗi khi Insert hoặc Update 'name', 'name_clean' sẽ tự đổi theo
DROP TRIGGER IF EXISTS trg_sync_disease_name_clean ON diseases;
CREATE TRIGGER trg_sync_disease_name_clean
BEFORE INSERT OR UPDATE OF name ON diseases
FOR EACH ROW EXECUTE FUNCTION sync_disease_name_clean();

-- Cập nhật dữ liệu cũ (nếu đã có data)
UPDATE "diseases" SET "name_clean" = lower(unaccent(name));

-- Tạo Index GIN trên cột sạch để search siêu nhanh
CREATE INDEX IF NOT EXISTS "idx_disease_name_clean_trgm" ON "diseases" USING gin ("name_clean" gin_trgm_ops);

-- (Giữ nguyên các lệnh khác của Prisma về vector, v.v.)
ALTER TABLE "diseases" ALTER COLUMN "embedding" TYPE vector(1536) USING "embedding"::vector(1536);