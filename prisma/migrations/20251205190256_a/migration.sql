-- DropForeignKey
ALTER TABLE "public"."UserSubscriptionValidity" DROP CONSTRAINT "UserSubscriptionValidity_subscribedPlanId_fkey";

-- AlterTable
ALTER TABLE "UserSubscriptionValidity" ADD COLUMN     "subscriptionPlanId" TEXT;
