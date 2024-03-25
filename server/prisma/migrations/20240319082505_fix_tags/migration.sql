-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_tagId_fkey";

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "tagId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE SET NULL ON UPDATE CASCADE;
