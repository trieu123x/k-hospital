/*
  Warnings:

  - The values [peak_hours] on the enum `ReportName` will be removed. If these variants are still used in the database, this will fail.
  - The `status` column on the `appointments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `degree` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `medicine_type` on the `medicines` table. All the data in the column will be lost.
  - The `role` column on the `profiles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `entity_id` on the `user_events` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'DOCTOR', 'PATIENT');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- AlterEnum
BEGIN;
CREATE TYPE "ReportName_new" AS ENUM ('raw_events', 'top_doctors', 'top_diseases', 'peak_shifts', 'daily_summary', 'chat_topics');
ALTER TABLE "etl_reports" ALTER COLUMN "report_name" TYPE "ReportName_new" USING ("report_name"::text::"ReportName_new");
ALTER TYPE "ReportName" RENAME TO "ReportName_old";
ALTER TYPE "ReportName_new" RENAME TO "ReportName";
DROP TYPE "public"."ReportName_old";
COMMIT;

-- DropIndex
DROP INDEX "user_events_entity_id_idx";

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "status",
ADD COLUMN     "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "degree",
ADD COLUMN     "degree_id" UUID;

-- AlterTable
ALTER TABLE "medicines" DROP COLUMN "medicine_type",
ADD COLUMN     "type_id" UUID;

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "avatar_crop_data" JSONB,
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole";

-- AlterTable
ALTER TABLE "user_events" DROP COLUMN "entity_id";

-- CreateTable
CREATE TABLE "degrees" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "rank_weight" INTEGER,

    CONSTRAINT "degrees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicine_types" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "medicine_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "degrees_name_key" ON "degrees"("name");

-- CreateIndex
CREATE UNIQUE INDEX "medicine_types_name_key" ON "medicine_types"("name");

-- CreateIndex
CREATE INDEX "appointments_doctor_id_date_status_idx" ON "appointments"("doctor_id", "date", "status");

-- CreateIndex
CREATE INDEX "idx_doctor_degree" ON "doctors"("degree_id");

-- CreateIndex
CREATE INDEX "idx_medicine_type" ON "medicines"("type_id");

-- CreateIndex
CREATE INDEX "user_events_metadata_idx" ON "user_events" USING GIN ("metadata" jsonb_path_ops);

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_degree_id_fkey" FOREIGN KEY ("degree_id") REFERENCES "degrees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicines" ADD CONSTRAINT "medicines_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "medicine_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;
