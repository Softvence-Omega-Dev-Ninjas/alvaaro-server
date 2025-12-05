/*
  Warnings:

  - You are about to drop the column `accessLog` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "accessLog",
ADD COLUMN     "accessLogs" INTEGER NOT NULL DEFAULT 0;
