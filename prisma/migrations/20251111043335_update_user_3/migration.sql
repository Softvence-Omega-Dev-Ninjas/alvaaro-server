/*
  Warnings:

  - Added the required column `subscribedPlanId` to the `UserSubscriptionValidity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserSubscriptionValidity" ADD COLUMN     "subscribedPlanId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UserSubscriptionValidity" ADD CONSTRAINT "UserSubscriptionValidity_subscribedPlanId_fkey" FOREIGN KEY ("subscribedPlanId") REFERENCES "SubscriptionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
