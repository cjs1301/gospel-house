/*
  Warnings:

  - You are about to drop the column `end_time` on the `ministry_notices` table. All the data in the column will be lost.
  - You are about to drop the column `event_date` on the `ministry_notices` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `ministry_notices` table. All the data in the column will be lost.
  - Added the required column `end_date` to the `ministry_notices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `ministry_notices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ministry_notices" DROP COLUMN "end_time",
DROP COLUMN "event_date",
DROP COLUMN "start_time",
ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "ministry_events" (
    "id" TEXT NOT NULL,
    "notice_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "event_date" TIMESTAMP(3) NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "max_attendees" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ministry_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ministry_events_notice_id_idx" ON "ministry_events"("notice_id");

-- AddForeignKey
ALTER TABLE "ministry_events" ADD CONSTRAINT "ministry_events_notice_id_fkey" FOREIGN KEY ("notice_id") REFERENCES "ministry_notices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
