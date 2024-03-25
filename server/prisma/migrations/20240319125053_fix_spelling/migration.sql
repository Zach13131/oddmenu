-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "createdAt" SET DEFAULT now() + interval '5 hour';
