/*
  Warnings:

  - You are about to drop the column `address` on the `RealEstate` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `RealEstate` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `RealEstate` table. All the data in the column will be lost.
  - You are about to drop the column `zip` on the `RealEstate` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Yacht` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Yacht` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Yacht` table. All the data in the column will be lost.
  - You are about to drop the column `zip` on the `Yacht` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RealEstate" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "state",
DROP COLUMN "zip";

-- AlterTable
ALTER TABLE "Yacht" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "state",
DROP COLUMN "zip";
