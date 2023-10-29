/*
  Warnings:

  - You are about to drop the column `destinationWalletId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `sourceWalletId` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `recieverWalletId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderWalletId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_destinationWalletId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_sourceWalletId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "destinationWalletId",
DROP COLUMN "sourceWalletId",
ADD COLUMN     "recieverWalletId" TEXT NOT NULL,
ADD COLUMN     "senderWalletId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_senderWalletId_fkey" FOREIGN KEY ("senderWalletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_recieverWalletId_fkey" FOREIGN KEY ("recieverWalletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
