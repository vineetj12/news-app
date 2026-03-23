-- DropForeignKey
ALTER TABLE "Bookmark" DROP CONSTRAINT "Bookmark_articleId_fkey";

-- AlterTable
ALTER TABLE "Bookmark" ADD COLUMN     "title" TEXT,
ADD COLUMN     "url" TEXT,
ALTER COLUMN "articleId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;
