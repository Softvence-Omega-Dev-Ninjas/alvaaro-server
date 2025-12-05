/*
  Warnings:

  - You are about to drop the column `payabeAmount` on the `UserSubscriptionValidity` table. All the data in the column will be lost.
  - Added the required column `payableAmount` to the `UserSubscriptionValidity` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."UserSubscriptionValidity_subscribedPlan_key";

-- DropIndex
DROP INDEX "public"."UserSubscriptionValidity_userId_key";

-- AlterTable
ALTER TABLE "public"."UserSubscriptionValidity" DROP COLUMN "payabeAmount",
ADD COLUMN     "payableAmount" TEXT NOT NULL;
