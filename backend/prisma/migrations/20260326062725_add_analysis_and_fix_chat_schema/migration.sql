/*
  Warnings:

  - You are about to drop the column `content_summary` on the `chat_messages` table. All the data in the column will be lost.
  - Made the column `patient_id` on table `appointments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `doctor_id` on table `appointments` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `content` to the `chat_messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `chat_messages` table without a default value. This is not possible if the table is not empty.
  - Made the column `session_id` on table `chat_messages` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "MessageRole" AS ENUM ('USER', 'AI', 'SYSTEM');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('VIEW_DOCTOR', 'BOOK_APPOINTMENT', 'CANCEL_APPOINTMENT', 'VIEW_DISEASE', 'CHAT_AI_TOPIC');

-- CreateEnum
CREATE TYPE "ReportName" AS ENUM ('raw_events', 'top_doctors', 'top_diseases', 'peak_hours', 'daily_summary', 'chat_topics');

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_doctor_id_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_patient_id_fkey";

-- AlterTable
ALTER TABLE "appointments" ALTER COLUMN "patient_id" SET NOT NULL,
ALTER COLUMN "doctor_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "chat_messages" DROP COLUMN "content_summary",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "role" "MessageRole" NOT NULL,
ALTER COLUMN "session_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "chat_sessions" ADD COLUMN     "ended_at" TIMESTAMPTZ,
ADD COLUMN     "title" VARCHAR(255),
ADD COLUMN     "topic" VARCHAR(100);

-- CreateTable
CREATE TABLE "user_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "event_type" "EventType" NOT NULL,
    "entity_id" UUID,
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "etl_reports" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mode" VARCHAR(50) NOT NULL,
    "report_name" "ReportName" NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "total_events" INTEGER DEFAULT 0,
    "reports" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "etl_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_events_event_type_idx" ON "user_events"("event_type");

-- CreateIndex
CREATE INDEX "user_events_created_at_idx" ON "user_events"("created_at");

-- CreateIndex
CREATE INDEX "user_events_entity_id_idx" ON "user_events"("entity_id");

-- CreateIndex
CREATE INDEX "etl_reports_report_name_start_date_idx" ON "etl_reports"("report_name", "start_date");

-- CreateIndex
CREATE INDEX "chat_messages_session_id_created_at_idx" ON "chat_messages"("session_id", "created_at");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
