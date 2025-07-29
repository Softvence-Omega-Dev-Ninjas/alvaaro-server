/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import Stripe from 'stripe';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { ApiResponse } from 'src/utils/common/apiresponse/apiresponse';

@Injectable()
export class CouponService {
  private readonly stripe: Stripe;
  constructor(private readonly prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  }

  async createCoupon(createCouponDto: CreateCouponDto): Promise<any> {
    console.log('Creating coupon with data:', createCouponDto);

    let stripeCouponId: string | null = null;

    try {
      // First create the Stripe coupon
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
          couponName: createCouponDto.couponName,
        },
      };

      const existingCoupon = (await this.prisma.coupon.findMany({
        where: {
          couponCode: createCouponDto.couponCode,
          OR: [
            {
              start_date: createCouponDto.start_date,
            },
            {
              redeem_by: createCouponDto.redeem_by,
            },
          ],
        },
      })) as unknown;

      console.log('Existing coupons found:', existingCoupon);

      if (Array.isArray(existingCoupon) && existingCoupon.length > 0) {
        return ApiResponse.error(
          'Coupon already exists with the same start date or redeem by date and coupon code ',
        );
      }
      const stripeCoupon = await this.stripe.coupons.create(couponParams);
      stripeCouponId = stripeCoupon.id;

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
          data: couponData,
        });

        return ApiResponse.success(dbCoupon, 'Coupon created successfully');
      });

      console.log('Coupon created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error creating coupon:', error.message);

      // Rollback: Delete the Stripe coupon if it was created
      if (stripeCouponId) {
        try {
          await this.stripe.coupons.del(stripeCouponId);
          console.log(`Rolled back Stripe coupon: ${stripeCouponId}`);
        } catch (rollbackError) {
          console.error(
            'Failed to rollback Stripe coupon:',
            rollbackError.message,
          );
        }
      }
      throw new Error(`Error creating coupon: ${error.message}`);
    }
  }

  async findAll() {
    try {
      const couponsList = await this.stripe.coupons.list();
      const formattedCoupons = couponsList.data.map((coupon) => ({
        id: coupon.id,
        couponCode: coupon.name,
        percent_off: coupon.percent_off?.toString() || '0',
        redeem_by: coupon.metadata?.end_date || '',
        start_date: coupon.metadata?.start_date || '',
        couponName: coupon.metadata?.couponName || '',
      }));
      return ApiResponse.success(
        formattedCoupons,
        'Coupons fetched successfully',
      );
    } catch (error) {
      console.error('Error fetching coupons:', error.message);
      throw new Error(`Error fetching coupons: ${error.message}`);
    }
  }

  update(id: string, updateCouponDto: UpdateCouponDto) {
    // Update logic for the coupon can be implemented here
    // For now, we will just return a placeholder message
    return `This action updates a #${id} coupon with data: ${JSON.stringify(updateCouponDto)}`;
  }

  async removeCoupon(id: string) {
    let dbCouponData: any = null;

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

        // Store data for potential rollback
        dbCouponData = dbCoupon;

        // Delete from database first
        const deletedDbCoupon = await prisma.coupon.delete({
          where: { id },
        });

        // Then delete from Stripe
        const deletedStripeCoupon = await this.stripe.coupons.del(
          dbCoupon.couponCode,
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
      if (dbCouponData && error.message.includes('Stripe')) {
        try {
          await this.prisma.coupon.create({
            data: {
              couponCode: dbCouponData.couponCode,
              percent_off: dbCouponData.percent_off,
              redeem_by: dbCouponData.redeem_by,
              start_date: dbCouponData.start_date,
              couponName: dbCouponData.couponName,
            },
          });
          console.log('Successfully rolled back database coupon deletion');
        } catch (rollbackError) {
          console.error(
            'Failed to rollback database coupon deletion:',
            rollbackError.message,
          );
          console.error(
            'Manual intervention required - database record was deleted but Stripe deletion failed',
          );
        }
      }

      throw new Error(`Error deleting coupon: ${error.message}`);
    }
  }
}
