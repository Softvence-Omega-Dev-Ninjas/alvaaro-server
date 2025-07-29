/*
  Warnings:

  - You are about to drop the column `status` on the `SubscriptionPlan` table. All the data in the column will be lost.
  - Added the required column `stripePriceId` to the `SubscriptionPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeProductId` to the `SubscriptionPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubscriptionPlan" DROP COLUMN "status",
ADD COLUMN     "stripePriceId" TEXT NOT NULL,
ADD COLUMN     "stripeProductId" TEXT NOT NULL;
