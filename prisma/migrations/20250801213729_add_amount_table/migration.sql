-- CreateTable
CREATE TABLE "Amount" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Amount_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Amount" ADD CONSTRAINT "Amount_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
