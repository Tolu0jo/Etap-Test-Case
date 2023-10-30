/*
  Warnings:

  - You are about to drop the `PaymentSummary` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PaymentSummary" DROP CONSTRAINT "PaymentSummary_adminId_fkey";

-- DropTable
DROP TABLE "PaymentSummary";
