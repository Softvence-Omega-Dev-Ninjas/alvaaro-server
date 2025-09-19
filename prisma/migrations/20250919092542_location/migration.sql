-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "location" JSONB NOT NULL DEFAULT '{}';
