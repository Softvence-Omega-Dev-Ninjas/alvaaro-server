/*
  Warnings:

  - Added the required column `address` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `price` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "zip" TEXT NOT NULL,
DROP COLUMN "price",
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL;
