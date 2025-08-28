/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Amount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Amount` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Amount" DROP CONSTRAINT "Amount_sellerId_fkey";

-- AlterTable
ALTER TABLE "Amount" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "sellerId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Amount_userId_key" ON "Amount"("userId");

-- AddForeignKey
ALTER TABLE "Amount" ADD CONSTRAINT "Amount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Amount" ADD CONSTRAINT "Amount_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE SET NULL ON UPDATE CASCADE;
