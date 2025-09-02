import { Injectable } from "@nestjs/common"
import { CreateCouponDto } from "./dto/create-coupon.dto"
import Stripe from "stripe"
import { PrismaService } from "src/prisma-service/prisma-service.service"
import { ApiResponse } from "src/utils/common/apiresponse/apiresponse"
import { HelperService } from "src/utils/helper/helper.service"

@Injectable()
export class CouponService {
	private readonly stripe: Stripe
	constructor(
		private readonly prisma: PrismaService,
		private readonly helperService: HelperService
	) {
		this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
	}

	async createCoupon(createCouponDto: CreateCouponDto): Promise<any> {
		try {
			// Step 1: Validation
			const existingCoupon = await this.helperService.couponExists(createCouponDto.couponCode)
			console.log("Existing Coupon:", existingCoupon)
			if (existingCoupon.length > 0) {
				return ApiResponse.error("Coupon already exists with the same code and discount percentage")
			}

			// Step 2: Prepare Stripe params
			const couponParams: Stripe.CouponCreateParams = {
				name: createCouponDto.couponCode,
				duration: "once",
				percent_off: parseFloat(createCouponDto.percent_off),
				currency: "usd",
				redeem_by: createCouponDto.redeem_by ? Math.floor(new Date(createCouponDto.redeem_by).getTime() / 1000) : undefined,
				metadata: {
					start_date: createCouponDto.start_date ? new Date(createCouponDto.start_date).toISOString() : "",
					end_date: createCouponDto.redeem_by ? new Date(createCouponDto.redeem_by).toISOString() : ""
				}
			}

			// Step 3: Create coupon in Stripe
			const stripeCoupon = await this.stripe.coupons.create(couponParams)
			if (!stripeCoupon.id) {
				return ApiResponse.error("Failed to create coupon in Stripe")
			}
			try {
				// Step 4: Create record in database using Prisma transaction
				await this.prisma.$transaction(async (prisma) => {
					const dbCoupon = await prisma.coupon.create({
						data: {
							percent_off: (stripeCoupon.percent_off ?? 0).toString(),
							redeem_by: stripeCoupon.metadata?.end_date ?? "",
							start_date: stripeCoupon.metadata?.start_date ?? "",
							couponCode: stripeCoupon.name ?? "",
							stripeCouponId: stripeCoupon.id
						}
					})
					return ApiResponse.success(dbCoupon, "Coupon created successfully")
				})
			} catch (dbError) {
				console.error("Database transaction failed. Rolling back Stripe coupon.")

				// Attempt to delete the coupon from Stripe to mimic rollback
				try {
					await this.stripe.coupons.del(stripeCoupon.id)
					console.log("Stripe coupon rolled back successfully.")
				} catch (stripeRollbackError) {
					console.error("Failed to rollback Stripe coupon:", stripeRollbackError.message)
				}

				throw dbError
			}

			return ApiResponse.success(stripeCoupon, "Coupon created successfully")
		} catch (error) {
			console.error("Error creating coupon:", error.message)
			return ApiResponse.error("Failed to create coupon")
		}
	}

	async findAll() {
		try {
			const coupons = await this.prisma.coupon.findMany({
				orderBy: { createdAt: "desc" },
				select: {
					id: true,
					stripeCouponId: false,
					couponCode: true,
					percent_off: true,
					redeem_by: true,
					start_date: true,
					createdAt: false,
					updatedAt: false
				}
			})
			return ApiResponse.success(coupons, "Coupons fetched successfully")
		} catch (error) {
			return ApiResponse.error("Failed to fetch coupons", error.message)
		}
	}

	async removeCoupon(id: string) {
		try {
			// Use transaction to ensure both operations succeed or fail together
			return await this.prisma.$transaction(async (prisma) => {
				// First get the coupon from database
				const dbCoupon = await prisma.coupon.findUnique({
					where: { id }
				})

				if (!dbCoupon) {
					throw new Error("Coupon not found in database")
				}

				// Delete from database first
				const deletedDbCoupon = await prisma.coupon.delete({
					where: { id }
				})

				// Then delete from Stripe
				const deletedStripeCoupon = await this.stripe.coupons.del(dbCoupon.stripeCouponId)

				return ApiResponse.success(
					{
						stripe: deletedStripeCoupon,
						database: deletedDbCoupon
					},
					"Coupon deleted successfully"
				)
			})
		} catch (error) {
			console.error("Error deleting coupon:", error.message)
		}
	}
}
