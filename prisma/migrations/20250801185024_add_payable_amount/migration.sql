/*
  Warnings:

  - Added the required column `payabeAmount` to the `UserSubscriptionValidity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserSubscriptionValidity" ADD COLUMN     "payabeAmount" TEXT NOT NULL;
