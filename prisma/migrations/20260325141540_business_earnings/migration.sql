-- AlterTable
ALTER TABLE "commissions" ADD COLUMN     "businessEarnings" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "workerCommission" DOUBLE PRECISION NOT NULL DEFAULT 45;
