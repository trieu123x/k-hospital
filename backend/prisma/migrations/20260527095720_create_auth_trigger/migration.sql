-- DropIndex
DROP INDEX "user_events_metadata_idx";

-- CreateTable
CREATE TABLE "doctor_chunks" (
    "id" UUID NOT NULL,
    "doctor_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" vector(768),

    CONSTRAINT "doctor_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disease_chunks" (
    "id" UUID NOT NULL,
    "disease_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" vector(768),

    CONSTRAINT "disease_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicine_chunks" (
    "id" UUID NOT NULL,
    "medicine_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" vector(768),

    CONSTRAINT "medicine_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_events_metadata_idx" ON "user_events" USING GIN ("metadata" jsonb_path_ops);

-- AddForeignKey
ALTER TABLE "doctor_chunks" ADD CONSTRAINT "doctor_chunks_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disease_chunks" ADD CONSTRAINT "disease_chunks_disease_id_fkey" FOREIGN KEY ("disease_id") REFERENCES "diseases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicine_chunks" ADD CONSTRAINT "medicine_chunks_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "medicines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 1. Tạo Function xử lý logic chép dữ liệu
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Chèn dữ liệu vào bảng "profiles"
  INSERT INTO public.profiles (
    id, 
    "full_name", 
    email, 
    phone, 
    role, 
    is_active, 
    created_at
  )
  VALUES (
    NEW.id, -- Lấy ID tự động từ Supabase Auth
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Người dùng mới'), -- Rút từ metadata
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'PATIENT')::"UserRole",
    true,
    NOW()
  );
  RETURN NEW;
END;
$$;

-- 2. Dọn dẹp Trigger cũ (tránh lỗi nếu bạn chạy lại nhiều lần)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Gắn Trigger vào bảng auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();