-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessTokenTiktok" TEXT NOT NULL,
    "refreshTokenTiktok" TEXT NOT NULL,
    "accessTokenInstagram" TEXT NOT NULL,
    "refreshTokenInstagram" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);
