-- CreateEnum
CREATE TYPE "public"."CategoryType" AS ENUM ('CAR', 'WATCH', 'JEWELLERY', 'REAL_ESTATE', 'YACHT');

-- CreateEnum
CREATE TYPE "public"."SubscriptionPlanType" AS ENUM ('BASIC', 'BUSINESS', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('USER', 'SELLER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "public"."VerificationStatusType" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."SubscriptionStatusType" AS ENUM ('ACTIVE', 'EXPIRED');

-- CreateTable
CREATE TABLE "public"."Amount" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sellerId" TEXT,

    CONSTRAINT "Amount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Coupon" (
    "id" TEXT NOT NULL,
    "stripeCouponId" TEXT NOT NULL,
    "couponCode" TEXT NOT NULL,
    "percent_off" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "redeem_by" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."Product" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "images" TEXT[],
    "category" "public"."CategoryType" NOT NULL,
    "isExclusive" BOOLEAN,
    "views" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "longitude" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "trending" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."SubscriptionPlan" (
    "id" TEXT NOT NULL,
    "type" "public"."SubscriptionPlanType" NOT NULL,
    "length" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "features" TEXT[],
    "stripeProductId" TEXT NOT NULL,
    "stripePriceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Token" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessTokenTiktok" TEXT,
    "refreshTokenTiktok" TEXT,
    "accessTokenInstagram" TEXT,
    "refreshTokenInstagram" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserSubscriptionValidity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subscribedPlan" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "expiryTime" TIMESTAMP(3) NOT NULL,
    "payabeAmount" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "images" TEXT,
    "role" "public"."UserRole" NOT NULL DEFAULT 'USER',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "otp" TEXT,
    "otpExpiry" TEXT,
    "isOtpVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "amountId" TEXT
);

-- CreateTable
CREATE TABLE "public"."Seller" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyWebsite" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "document" TEXT[],
    "verificationStatus" "public"."VerificationStatusType" NOT NULL DEFAULT 'PENDING',
    "subscriptionStatus" BOOLEAN NOT NULL DEFAULT false,
    "subscriptionsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."Car" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "manufacture" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "carBodyStyle" TEXT NOT NULL,
    "transmission" TEXT NOT NULL,
    "mileage" TEXT NOT NULL,
    "cylinders" TEXT NOT NULL,
    "tractionType" TEXT NOT NULL,
    "fuelType" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "public"."Watch" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "manufacture" TEXT NOT NULL,
    "warranty" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "waterResistance" TEXT NOT NULL,
    "displayType" TEXT NOT NULL,
    "strapMaterial" TEXT NOT NULL,
    "movement" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "tractionType" TEXT NOT NULL,
    "features" TEXT[]
);

-- CreateTable
CREATE TABLE "public"."Jewellery" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "manufacture" TEXT NOT NULL,
    "warranty" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "waterResistance" TEXT NOT NULL,
    "displayType" TEXT NOT NULL,
    "strapMaterial" TEXT NOT NULL,
    "movement" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "tractionType" TEXT NOT NULL,
    "features" TEXT[]
);

-- CreateTable
CREATE TABLE "public"."RealEstate" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "beds" TEXT NOT NULL,
    "washroom" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "features" TEXT[]
);

-- CreateTable
CREATE TABLE "public"."Yacht" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "beds" TEXT NOT NULL,
    "washroom" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "features" TEXT[]
);

-- CreateTable
CREATE TABLE "public"."Wishlist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "public"."Contact" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."Inquiry" (
    "id" TEXT NOT NULL,
    "buyerName" TEXT NOT NULL,
    "buyerEmail" TEXT NOT NULL,
    "buyerPhone" TEXT,
    "message" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Newsletter" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_id_key" ON "public"."Coupon"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_stripeCouponId_key" ON "public"."Coupon"("stripeCouponId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_id_key" ON "public"."Product"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPlan_type_key" ON "public"."SubscriptionPlan"("type");

-- CreateIndex
CREATE UNIQUE INDEX "UserSubscriptionValidity_id_key" ON "public"."UserSubscriptionValidity"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserSubscriptionValidity_userId_key" ON "public"."UserSubscriptionValidity"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSubscriptionValidity_subscribedPlan_key" ON "public"."UserSubscriptionValidity"("subscribedPlan");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "public"."User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_id_key" ON "public"."Seller"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_userId_key" ON "public"."Seller"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Car_id_key" ON "public"."Car"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Car_productId_key" ON "public"."Car"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Watch_id_key" ON "public"."Watch"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Watch_productId_key" ON "public"."Watch"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Jewellery_id_key" ON "public"."Jewellery"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Jewellery_productId_key" ON "public"."Jewellery"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "RealEstate_id_key" ON "public"."RealEstate"("id");

-- CreateIndex
CREATE UNIQUE INDEX "RealEstate_productId_key" ON "public"."RealEstate"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Yacht_id_key" ON "public"."Yacht"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Yacht_productId_key" ON "public"."Yacht"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_id_key" ON "public"."Wishlist"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_userId_productId_key" ON "public"."Wishlist"("userId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_id_key" ON "public"."Contact"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Newsletter_id_key" ON "public"."Newsletter"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Newsletter_email_key" ON "public"."Newsletter"("email");

-- AddForeignKey
ALTER TABLE "public"."Amount" ADD CONSTRAINT "Amount_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "public"."Seller"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "public"."Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserSubscriptionValidity" ADD CONSTRAINT "UserSubscriptionValidity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_amountId_fkey" FOREIGN KEY ("amountId") REFERENCES "public"."Amount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Seller" ADD CONSTRAINT "Seller_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Seller" ADD CONSTRAINT "Seller_subscriptionsId_fkey" FOREIGN KEY ("subscriptionsId") REFERENCES "public"."UserSubscriptionValidity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Car" ADD CONSTRAINT "Car_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Watch" ADD CONSTRAINT "Watch_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Jewellery" ADD CONSTRAINT "Jewellery_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RealEstate" ADD CONSTRAINT "RealEstate_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Yacht" ADD CONSTRAINT "Yacht_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Wishlist" ADD CONSTRAINT "Wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Wishlist" ADD CONSTRAINT "Wishlist_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inquiry" ADD CONSTRAINT "Inquiry_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inquiry" ADD CONSTRAINT "Inquiry_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "public"."Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
