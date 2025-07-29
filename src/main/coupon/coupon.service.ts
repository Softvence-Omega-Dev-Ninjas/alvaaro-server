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
        duration: 'once', // Add required duration field
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

      const existingCoupon = await this.prisma.coupon.findMany({
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
      });
      console.log('Existing coupons found:', existingCoupon);
      if (existingCoupon) {
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

      // Throw the original error instead of returning a string
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

  removeCoupon(id: string) {
    try {
      const deletedCoupon = this.stripe.coupons.del(id);
      return ApiResponse.success(deletedCoupon, 'Coupon deleted successfully');
    } catch (error) {
      console.error('Error deleting coupon:', error.message);
      throw new Error(`Error deleting coupon: ${error.message}`);
    }
  }
}
