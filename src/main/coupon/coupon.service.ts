import { Injectable } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import Stripe from 'stripe';

@Injectable()
export class CouponService {
  private readonly stripe: Stripe;

  constructor() {
    // Initialize Stripe with your secret key
    this.stripe = new Stripe(
      'sk_test_51R5NAuFl8CziaLNQUMjQuhbOKbnrQmhRtqEwQP6ac8FpzjApNQLiGH2IbbuoM473ge7JZO91Fhi1YGnsMHZeHlKD00TSUsE8AX',
      { apiVersion: '2025-06-30.basil' },
    );
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

  findAll() {
    return `This action returns all coupon`;
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
