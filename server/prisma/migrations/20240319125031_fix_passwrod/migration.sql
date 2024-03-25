-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "password" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "createdAt" SET DEFAULT now() + interval '5 hour';
