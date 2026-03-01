/*
  Warnings:

  - Added the required column `updatedAt` to the `service_add_ons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "service_add_ons" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
