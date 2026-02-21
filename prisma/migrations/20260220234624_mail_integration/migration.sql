-- AlterTable
ALTER TABLE "users" ADD COLUMN     "otpSecret" TEXT,
ADD COLUMN     "otpSecretExpires" TIMESTAMP(3),
ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpires" TIMESTAMP(3);
