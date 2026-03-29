/*
  Warnings:

  - You are about to drop the column `date` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `shift` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `profiles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[schedule_id]` on the table `appointments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `schedule_id` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "date",
DROP COLUMN "shift",
ADD COLUMN     "schedule_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "status",
ADD COLUMN     "email" TEXT,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "schedules" (
    "id" UUID NOT NULL,
    "doctor_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "shift" INTEGER NOT NULL,
    "is_booked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "schedules_doctor_id_date_idx" ON "schedules"("doctor_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "schedules_doctor_id_date_shift_key" ON "schedules"("doctor_id", "date", "shift");

-- CreateIndex
CREATE UNIQUE INDEX "appointments_schedule_id_key" ON "appointments"("schedule_id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
