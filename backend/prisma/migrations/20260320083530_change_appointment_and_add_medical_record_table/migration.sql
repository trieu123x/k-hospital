/*
  Warnings:

  - You are about to drop the column `diagnosis_result` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `slot_time` on the `appointments` table. All the data in the column will be lost.
  - Added the required column `date` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shift` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "diagnosis_result",
DROP COLUMN "slot_time",
ADD COLUMN     "date" DATE NOT NULL,
ADD COLUMN     "reason" TEXT,
ADD COLUMN     "shift" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL;

-- CreateTable
CREATE TABLE "medical_records" (
    "id" UUID NOT NULL,
    "appointment_id" UUID NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "prescription" TEXT,
    "note" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "medical_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "medical_records_appointment_id_key" ON "medical_records"("appointment_id");

-- AddForeignKey
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
