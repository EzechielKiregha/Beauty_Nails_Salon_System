/*
  Warnings:

  - You are about to alter the column `price` on the `appointments` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `totalSpent` on the `client_profiles` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `totalRevenue` on the `commissions` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `commissionRate` on the `commissions` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `DoublePrecision`.
  - You are about to alter the column `commissionAmount` on the `commissions` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `openingCash` on the `daily_registers` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `closingCash` on the `daily_registers` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `expectedCash` on the `daily_registers` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `discrepancy` on the `daily_registers` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `totalSales` on the `daily_registers` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `cashSales` on the `daily_registers` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `cardSales` on the `daily_registers` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `mobileSales` on the `daily_registers` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `value` on the `discount_codes` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `cost` on the `inventory_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `price` on the `memberships` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `discount` on the `memberships` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `DoublePrecision`.
  - You are about to alter the column `amount` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `price` on the `sale_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `discount` on the `sale_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `total` on the `sales` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `subtotal` on the `sales` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `discount` on the `sales` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `tax` on the `sales` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `tip` on the `sales` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `price` on the `service_add_ons` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `price` on the `service_packages` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `discount` on the `service_packages` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `DoublePrecision`.
  - You are about to alter the column `price` on the `services` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `commissionRate` on the `worker_profiles` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `DoublePrecision`.
  - You are about to alter the column `rating` on the `worker_profiles` table. The data in that column could be lost. The data in that column will be cast from `Decimal(3,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "appointments" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "client_profiles" ALTER COLUMN "totalSpent" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "commissions" ALTER COLUMN "totalRevenue" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "commissionRate" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "commissionAmount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "daily_registers" ALTER COLUMN "openingCash" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "closingCash" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "expectedCash" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "discrepancy" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "totalSales" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "cashSales" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "cardSales" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "mobileSales" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "discount_codes" ALTER COLUMN "value" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "minPurchase" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "inventory_items" ALTER COLUMN "cost" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "inventory_transactions" ALTER COLUMN "cost" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "marketing_campaigns" ALTER COLUMN "openRate" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "clickRate" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "memberships" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "discount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "reorder_requests" ALTER COLUMN "estimatedCost" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "sale_items" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "discount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "sales" ALTER COLUMN "total" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "subtotal" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "discount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "tax" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "tip" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "service_add_ons" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "service_packages" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "discount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "services" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "worker_profiles" ALTER COLUMN "commissionRate" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "rating" SET DATA TYPE DOUBLE PRECISION;
