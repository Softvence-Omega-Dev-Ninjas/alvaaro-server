/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import Stripe from 'stripe';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { ApiResponse } from 'src/utils/common/apiresponse/apiresponse';
import { HelperService } from 'src/utils/helper/helper.service';

@Injectable()
export class CouponService {
  private readonly stripe: Stripe;
  constructor(
    private readonly prisma: PrismaService,
    private readonly helperService: HelperService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  }

  async createCoupon(createCouponDto: CreateCouponDto): Promise<any> {
    console.log('Creating coupon with data:', createCouponDto);

    try {
      const existingCoupon = await this.helperService.couponExists(
        createCouponDto.couponCode,
        createCouponDto.percent_off,
      );
      const couponParams: Stripe.CouponCreateParams = {
        name: createCouponDto.couponCode,
        duration: 'once',
        percent_off: parseFloat(createCouponDto.percent_off),
        currency: 'usd',
        redeem_by: createCouponDto.redeem_by
          ? Math.floor(new Date(createCouponDto.redeem_by).getTime() / 1000)
          : undefined,
        metadata: {
          start_date: createCouponDto.start_date
            ? new Date(createCouponDto.start_date).toISOString()
            : '',
          end_date: createCouponDto.redeem_by
            ? new Date(createCouponDto.redeem_by).toISOString()
            : '',
        },
      };

      if (Array.isArray(existingCoupon) && existingCoupon.length > 0) {
        return ApiResponse.error(
          'Coupon already exists with the same start date or redeem by date and coupon code ',
        );
      }
      const stripeCoupon = await this.stripe.coupons.create(couponParams);

      // Use Prisma transaction to create database record
      const result = await this.prisma.$transaction(async (prisma) => {
        const couponData = {
          couponCode: stripeCoupon.name ?? '',
          percent_off: (stripeCoupon.percent_off ?? 0).toString(),
          redeem_by: stripeCoupon.metadata?.end_date ?? '',
          start_date: stripeCoupon.metadata?.start_date ?? '',
          couponName: stripeCoupon.metadata?.couponName ?? '',
        };

        const dbCoupon = await prisma.coupon.create({
          data: {
            ...couponData,
            stripeCouponId: stripeCoupon.id,
          },
        });

        return ApiResponse.success(dbCoupon, 'Coupon created successfully');
      });

      console.log('Coupon created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error creating coupon:', error.message);
    }
  }

  async findAll() {
    try {
      const coupons = await this.prisma.coupon.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return ApiResponse.success(coupons, 'Coupons fetched successfully');
    } catch (error) {
      console.error('Error fetching coupons:', error.message);
      throw new Error(`Error fetching coupons: ${error.message}`);
    }
  }

  update(id: string, updateCouponDto: UpdateCouponDto) {
    return `This action updates a #${id} coupon with data: ${JSON.stringify(updateCouponDto)}`;
  }

  async removeCoupon(id: string) {
    try {
      // Use transaction to ensure both operations succeed or fail together
      return await this.prisma.$transaction(async (prisma) => {
        // First get the coupon from database
        const dbCoupon = await prisma.coupon.findUnique({
          where: { id },
        });

        if (!dbCoupon) {
          throw new Error('Coupon not found in database');
        }

        // Delete from database first
        const deletedDbCoupon = await prisma.coupon.delete({
          where: { id },
        });

        // Then delete from Stripe
        const deletedStripeCoupon = await this.stripe.coupons.del(
          dbCoupon.stripeCouponId,
        );

        return ApiResponse.success(
          {
            stripe: deletedStripeCoupon,
            database: deletedDbCoupon,
          },
          'Coupon deleted successfully',
        );
      });
    } catch (error) {
      console.error('Error deleting coupon:', error.message);
    }
  }
}
