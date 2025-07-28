import { Injectable } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import Stripe from 'stripe';

@Injectable()
export class CouponService {
  private readonly stripe: Stripe;

  constructor() {
    // Initialize Stripe with your secret key
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2025-06-30.basil',
    });
  }

  async createCoupon() {
    try {
      const coupon = await this.stripe.coupons.create({
        duration: 'repeating',
        percent_off: 25,
        redeem_by: Math.floor(new Date('2025-10-1').getTime() / 1000),
        duration_in_months: 3,
        name: 'Limited Time Offer',
        metadata: {
          start_date: '2025-08-01',
        },
      });
      return coupon;
    } catch (error) {
      console.error('Error creating coupon:', error.message);
      return `Error creating coupon: ${error.message}`;
    }
  }

  async findAll() {
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
      metadata: coupon.metadata,
    }));
    return coupons;
  }

  findOne(id: number) {
    return `This action returns a #${id} coupon`;
  }

  update(id: number, updateCouponDto: UpdateCouponDto) {
    return `This action updates a #${id} coupon`;
  }

  remove(id: number) {
    return `This action removes a #${id} coupon`;
  }
}
