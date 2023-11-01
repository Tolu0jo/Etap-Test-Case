/*
  Warnings:

  - The primary key for the `PaymentSummary` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `WalletBallance` on the `PaymentSummary` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `PaymentSummary` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `PaymentSummary` table. All the data in the column will be lost.
  - You are about to drop the column `pstackId` on the `PaymentSummary` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `PaymentSummary` table. All the data in the column will be lost.
  - You are about to drop the column `walletId` on the `PaymentSummary` table. All the data in the column will be lost.
  - The `id` column on the `PaymentSummary` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PaymentSummary" DROP CONSTRAINT "PaymentSummary_pkey",
DROP COLUMN "WalletBallance",
DROP COLUMN "amount",
DROP COLUMN "currency",
DROP COLUMN "pstackId",
DROP COLUMN "userId",
DROP COLUMN "walletId",
ADD COLUMN     "month" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pendingPayments" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "successfulPayments" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalPayments" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "year" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "PaymentSummary_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "PaymentDetails" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "walletId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "pstackId" DOUBLE PRECISION NOT NULL,
    "WalletBallance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PaymentDetails_pkey" PRIMARY KEY ("id")
);
