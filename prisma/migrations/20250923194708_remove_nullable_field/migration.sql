/*
  Warnings:

  - Made the column `subscriptionsId` on table `Seller` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Seller" DROP CONSTRAINT "Seller_subscriptionsId_fkey";

-- AlterTable
ALTER TABLE "public"."Seller" ALTER COLUMN "subscriptionsId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Seller" ADD CONSTRAINT "Seller_subscriptionsId_fkey" FOREIGN KEY ("subscriptionsId") REFERENCES "public"."UserSubscriptionValidity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
