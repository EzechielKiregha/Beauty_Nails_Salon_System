-- AlterTable
ALTER TABLE "worker_profiles" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "commissionDay" INTEGER,
ADD COLUMN     "commissionFrequency" TEXT,
ADD COLUMN     "commissionType" TEXT,
ADD COLUMN     "lastCommissionPaidAt" TIMESTAMP(3),
ADD COLUMN     "minimumPayout" DOUBLE PRECISION,
ADD COLUMN     "payoutThresholdMetAt" TIMESTAMP(3);
