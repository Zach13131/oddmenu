-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "createdAt" SET DEFAULT now() + interval '5 hour';

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "createdAt" SET DEFAULT now() + interval '5 hour';
