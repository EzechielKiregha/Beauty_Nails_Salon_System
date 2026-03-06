/*
  Warnings:

  - A unique constraint covering the columns `[referredId]` on the table `referrals` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "referrals_referrerId_key";

-- CreateIndex
CREATE UNIQUE INDEX "referrals_referredId_key" ON "referrals"("referredId");
