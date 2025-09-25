/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `UserSubscriptionValidity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserSubscriptionValidity_userId_key" ON "public"."UserSubscriptionValidity"("userId");
