/*
  Warnings:

  - Added the required column `WalletBallance` to the `PaymentSummary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaymentSummary" ADD COLUMN     "WalletBallance" DOUBLE PRECISION NOT NULL;
