/*
  Warnings:

  - Added the required column `listingLimit` to the `SubscriptionPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubscriptionPlan" ADD COLUMN     "listingLimit" INTEGER NOT NULL;
