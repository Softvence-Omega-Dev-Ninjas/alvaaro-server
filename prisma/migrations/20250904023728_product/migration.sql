/*
  Warnings:

  - You are about to drop the column `feature` on the `RealEstate` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `RealEstate` table. All the data in the column will be lost.
  - You are about to drop the column `feature` on the `Yacht` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Yacht` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RealEstate" DROP COLUMN "feature",
DROP COLUMN "text",
ADD COLUMN     "features" TEXT[];

-- AlterTable
ALTER TABLE "Yacht" DROP COLUMN "feature",
DROP COLUMN "text",
ADD COLUMN     "features" TEXT[];
