/*
  Warnings:

  - You are about to drop the column `approved` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "approved",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'APPROVED';
