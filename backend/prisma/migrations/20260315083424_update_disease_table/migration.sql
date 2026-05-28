-- Kích hoạt Extension
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS vector;

-- ==========================================
-- 1. BẢNG DISEASES 
-- ==========================================
ALTER TABLE "diseases" ADD COLUMN IF NOT EXISTS "name_clean" TEXT;

-- Tạo hàm tự động xóa dấu và chuyển thành chữ thường
CREATE OR REPLACE FUNCTION sync_disease_name_clean() 
RETURNS trigger AS $$
BEGIN
  -- Hàm unaccent() có sẵn của Postgres sẽ xử lý việc xóa dấu
  NEW.name_clean := lower(unaccent(replace(replace(NEW.name, 'Đ', 'D'), 'đ', 'd')));
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

-- ==========================================
-- 2. BẢNG PROFILES (Tìm kiếm theo fullName)
-- ==========================================
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "full_name_clean" TEXT;

CREATE OR REPLACE FUNCTION sync_profile_fullname_clean() 
RETURNS trigger AS $$
BEGIN
  NEW.full_name_clean := lower(unaccent(replace(replace(NEW.full_name, 'Đ', 'D'), 'đ', 'd')));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_profile_fullname_clean ON profiles;
CREATE TRIGGER trg_sync_profile_fullname_clean
BEFORE INSERT OR UPDATE OF full_name ON profiles
FOR EACH ROW EXECUTE FUNCTION sync_profile_fullname_clean();

UPDATE "profiles" SET "full_name_clean" = lower(unaccent(replace(replace(full_name, 'Đ', 'D'), 'đ', 'd')));
CREATE INDEX IF NOT EXISTS "idx_profile_fullname_clean_trgm" ON "profiles" USING gin ("full_name_clean" gin_trgm_ops);


-- ==========================================
-- 3. BẢNG MEDICINES (Tìm kiếm theo name)
-- ==========================================
ALTER TABLE "medicines" ADD COLUMN IF NOT EXISTS "name_clean" TEXT;

CREATE OR REPLACE FUNCTION sync_medicine_name_clean() 
RETURNS trigger AS $$
BEGIN
  NEW.name_clean := lower(unaccent(replace(replace(NEW.name, 'Đ', 'D'), 'đ', 'd')));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_medicine_name_clean ON medicines;
CREATE TRIGGER trg_sync_medicine_name_clean
BEFORE INSERT OR UPDATE OF name ON medicines
FOR EACH ROW EXECUTE FUNCTION sync_medicine_name_clean();

UPDATE "medicines" SET "name_clean" = lower(unaccent(replace(replace(name, 'Đ', 'D'), 'đ', 'd')));
CREATE INDEX IF NOT EXISTS "idx_medicine_name_clean_trgm" ON "medicines" USING gin ("name_clean" gin_trgm_ops);


-- ==========================================
-- 4. BẢNG NEWS (Tìm kiếm theo title)
-- ==========================================
ALTER TABLE "news" ADD COLUMN IF NOT EXISTS "title_clean" TEXT;

CREATE OR REPLACE FUNCTION sync_news_title_clean() 
RETURNS trigger AS $$
BEGIN
  NEW.title_clean := lower(unaccent(replace(replace(NEW.title, 'Đ', 'D'), 'đ', 'd')));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_news_title_clean ON news;
CREATE TRIGGER trg_sync_news_title_clean
BEFORE INSERT OR UPDATE OF title ON news
FOR EACH ROW EXECUTE FUNCTION sync_news_title_clean();

UPDATE "news" SET "title_clean" = lower(unaccent(replace(replace(title, 'Đ', 'D'), 'đ', 'd')));
CREATE INDEX IF NOT EXISTS "idx_news_title_clean_trgm" ON "news" USING gin ("title_clean" gin_trgm_ops);