/*
  Warnings:

  - Added the required column `startTime` to the `UserSubscriptionValidity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserSubscriptionValidity" ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;
