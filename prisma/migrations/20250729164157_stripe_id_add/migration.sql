/*
  Warnings:

  - A unique constraint covering the columns `[stripeCouponId]` on the table `Coupon` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripeCouponId` to the `Coupon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Coupon" ADD COLUMN     "stripeCouponId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_stripeCouponId_key" ON "Coupon"("stripeCouponId");
