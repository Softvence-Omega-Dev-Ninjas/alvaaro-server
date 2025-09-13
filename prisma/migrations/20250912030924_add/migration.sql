/*
  Warnings:

  - You are about to drop the column `userId` on the `Amount` table. All the data in the column will be lost.
  - Added the required column `invoiceNumber` to the `Amount` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Amount" DROP CONSTRAINT "Amount_userId_fkey";

-- DropIndex
DROP INDEX "Amount_userId_key";

-- AlterTable
ALTER TABLE "Amount" DROP COLUMN "userId",
ADD COLUMN     "invoiceNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "amountId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_amountId_fkey" FOREIGN KEY ("amountId") REFERENCES "Amount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
