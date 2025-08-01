/*
  Warnings:

  - A unique constraint covering the columns `[sellerId,subscribedPlan]` on the table `UserSubscriptionValidity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserSubscriptionValidity_sellerId_subscribedPlan_key" ON "UserSubscriptionValidity"("sellerId", "subscribedPlan");
