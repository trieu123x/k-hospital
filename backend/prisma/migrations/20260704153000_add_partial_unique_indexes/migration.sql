-- DropIndex
DROP INDEX IF EXISTS "degrees_name_key";

-- DropIndex
DROP INDEX IF EXISTS "disease_categories_name_key";

-- DropIndex
DROP INDEX IF EXISTS "idx_disease_category";

-- DropIndex
DROP INDEX IF EXISTS "idx_disease_specialty";

-- DropIndex
DROP INDEX IF EXISTS "medicine_types_name_key";

-- DropIndex
DROP INDEX IF EXISTS "idx_medicine_type";

-- DropIndex
DROP INDEX IF EXISTS "specialties_name_key";

-- DropIndex
DROP INDEX IF EXISTS "user_events_metadata_idx";

-- AlterTable
ALTER TABLE "degrees" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "disease_categories" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "diseases" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "medicine_types" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "medicines" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "specialties" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "news" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "idx_disease_specialty_active" ON "diseases"("specialty_id", "deleted_at");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "idx_disease_category_active" ON "diseases"("category_id", "deleted_at");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "idx_medicine_type_active" ON "medicines"("type_id", "deleted_at");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "user_events_metadata_idx" ON "user_events" USING GIN ("metadata" jsonb_path_ops);

-- Create Unique Indexes for Active Records
CREATE UNIQUE INDEX IF NOT EXISTS "idx_specialties_name_unique_active" 
ON "specialties"("name") WHERE "deleted_at" IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "idx_disease_categories_name_unique_active" 
ON "disease_categories"("name") WHERE "deleted_at" IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "idx_degrees_name_unique_active" 
ON "degrees"("name") WHERE "deleted_at" IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "idx_medicine_types_name_unique_active" 
ON "medicine_types"("name") WHERE "deleted_at" IS NULL;
