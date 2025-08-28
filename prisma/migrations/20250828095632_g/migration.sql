/*
  Warnings:

  - You are about to drop the column `sellerId` on the `UserSubscriptionValidity` table. All the data in the column will be lost.
  - Added the required column `userId` to the `UserSubscriptionValidity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserSubscriptionValidity" DROP CONSTRAINT "UserSubscriptionValidity_sellerId_fkey";

-- DropIndex
DROP INDEX "UserSubscriptionValidity_sellerId_key";

-- DropIndex
DROP INDEX "UserSubscriptionValidity_sellerId_subscribedPlan_key";

-- AlterTable
ALTER TABLE "Seller" ADD COLUMN     "subscriptionsId" TEXT;

-- AlterTable
ALTER TABLE "UserSubscriptionValidity" DROP COLUMN "sellerId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UserSubscriptionValidity" ADD CONSTRAINT "UserSubscriptionValidity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seller" ADD CONSTRAINT "Seller_subscriptionsId_fkey" FOREIGN KEY ("subscriptionsId") REFERENCES "UserSubscriptionValidity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
