/*
  Warnings:

  - You are about to drop the column `schedule_id` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the `schedules` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `date` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shift` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_schedule_id_fkey";

-- DropForeignKey
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_doctor_id_fkey";

-- DropIndex
DROP INDEX "appointments_schedule_id_key";

-- DropIndex
DROP INDEX "idx_appointment_doctor";

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "schedule_id",
ADD COLUMN     "date" DATE NOT NULL,
ADD COLUMN     "shift" INTEGER NOT NULL;

-- DropTable
DROP TABLE "schedules";

-- CreateTable
CREATE TABLE "doctor_leaves" (
    "id" UUID NOT NULL,
    "doctor_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "shift" INTEGER,
    "reason" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "doctor_leaves_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "doctor_leaves_doctor_id_date_idx" ON "doctor_leaves"("doctor_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_leaves_doctor_id_date_shift_key" ON "doctor_leaves"("doctor_id", "date", "shift");

-- CreateIndex
CREATE INDEX "appointments_doctor_id_date_status_idx" ON "appointments"("doctor_id", "date", "status");

-- AddForeignKey
ALTER TABLE "doctor_leaves" ADD CONSTRAINT "doctor_leaves_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "idx_appointment_patient" RENAME TO "appointments_patient_id_idx";
