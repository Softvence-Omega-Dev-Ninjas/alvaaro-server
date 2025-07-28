import { Injectable } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import Stripe from 'stripe';
import { PrismaService } from 'src/prisma-service/prisma-service.service';

@Injectable()
export class CouponService {
  private readonly stripe: Stripe;
  constructor(private readonly prisma: PrismaService) {
    // Initialize Stripe with your secret key
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2025-06-30.basil',
    });
  }

  async createCoupon(createCouponDto: CreateCouponDto) {
    console.log('Creating coupon with data:', createCouponDto);
    try {
      const couponParams: Stripe.CouponCreateParams = {
        name: createCouponDto.couponCode,
        duration: 'repeating',
        percent_off: parseFloat(createCouponDto.percent_off),
        currency: 'usd',
        redeem_by: createCouponDto.redeem_by
          ? Math.floor(new Date(createCouponDto.redeem_by).getTime() / 1000)
          : undefined,
        metadata: {
          start_date: createCouponDto.start_date
            ? new Date(createCouponDto.start_date).toISOString()
            : null,
          end_date: createCouponDto.redeem_by
            ? new Date(createCouponDto.redeem_by).toISOString()
            : null,
        },
      };

      const coupon = await this.stripe.coupons.create(couponParams);
      console.log('Coupon created successfully:', coupon);
      const formattedCoupon = {
        couponCode: coupon.name ?? '',
        percent_off: (coupon.percent_off ?? 0).toString(),
        redeem_by: coupon.metadata?.end_date ?? '',
        start_date: coupon.metadata?.start_date ?? '',
      };
      // const result = await this.prisma.coupon.create({
      //   data: formattedCoupon,
      // });
      // return result;
    } catch (error) {
      console.error('Error creating coupon:', error.message);
      return `Error creating coupon: ${error.message}`;
    }
  }

  async findAll() {
    try {
      const couponsList = await this.stripe.coupons.list({
        limit: 10,
      });
      const coupons = couponsList.data.map((coupon) => ({
        id: coupon.id,
        duration: coupon.duration,
        percent_off: coupon.percent_off,
        redeem_by: coupon.redeem_by ? new Date(coupon.redeem_by * 1000) : null,
        duration_in_months: coupon.duration_in_months,
        name: coupon.name,
        start_date: coupon.metadata?.start_date,
      }));
      return coupons;
    } catch (error) {
      console.error('Error fetching coupons:', error.message);
      throw new Error(`Error fetching coupons: ${error.message}`);
    }
  }

  update(id: string, updateCouponDto: UpdateCouponDto) {}

  removeCoupon(id: string) {
    const deletedCoupon = this.stripe.coupons.del(id);
    return deletedCoupon;
  }
}
