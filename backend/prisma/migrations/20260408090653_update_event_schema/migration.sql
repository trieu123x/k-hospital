/*
  Warnings:

  - The values [peak_hours] on the enum `ReportName` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `entity_id` on the `user_events` table. All the data in the column will be lost.

*/
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
ALTER TABLE "user_events" DROP COLUMN "entity_id";

-- CreateIndex
CREATE INDEX "user_events_metadata_idx" ON "user_events" USING GIN ("metadata" jsonb_path_ops);
