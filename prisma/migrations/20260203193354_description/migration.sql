-- AlterTable
ALTER TABLE "inventory_items" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "salon_profile" ALTER COLUMN "currency" SET DEFAULT 'CDF';
