/*
  Warnings:

  - You are about to drop the column `aiSummary` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `reliability` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `sentiment` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the `FollowedTopic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReadingHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FollowedTopic" DROP CONSTRAINT "FollowedTopic_userId_fkey";

-- DropForeignKey
ALTER TABLE "ReadingHistory" DROP CONSTRAINT "ReadingHistory_articleId_fkey";

-- DropForeignKey
ALTER TABLE "ReadingHistory" DROP CONSTRAINT "ReadingHistory_userId_fkey";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "aiSummary",
DROP COLUMN "reliability",
DROP COLUMN "sentiment";

-- DropTable
DROP TABLE "FollowedTopic";

-- DropTable
DROP TABLE "ReadingHistory";

-- DropEnum
DROP TYPE "Sentiment";
