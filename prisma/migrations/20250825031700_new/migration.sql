/*
  Warnings:

  - You are about to drop the column `premium` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "premium",
ADD COLUMN     "isExclusive" BOOLEAN;
