-- AlterTable
ALTER TABLE "Token" ALTER COLUMN "accessTokenTiktok" DROP NOT NULL,
ALTER COLUMN "refreshTokenTiktok" DROP NOT NULL,
ALTER COLUMN "accessTokenInstagram" DROP NOT NULL,
ALTER COLUMN "refreshTokenInstagram" DROP NOT NULL;
