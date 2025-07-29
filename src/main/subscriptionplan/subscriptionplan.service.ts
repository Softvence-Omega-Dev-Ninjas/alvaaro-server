/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubscriptionPlanDto } from './dto/create-subscriptionplan.dto';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { ApiResponse } from 'src/utils/common/apiresponse/apiresponse';
import { UpdateSubscriptionplanDto } from './dto/update-subscriptionplan.dto';
import Stripe from 'stripe';

@Injectable()
export class SubscriptionplanService {
  private stripe: Stripe;
  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {});
  }

  async createSubscription(dto: CreateSubscriptionPlanDto) {
    console.log(dto);
    try {
      const price = await this.stripe.prices.create({
        currency: 'usd',
        unit_amount: dto.price ? parseFloat(dto.price) * 100 : 0,
        product_data: {
          name: dto.type,
        },
      });

      return price;
      // // Upsert the subscription plan in stripe
      // await this.stripe.subscriptions.create({
      //   customer: dto.customerId,
      //   items: [
      //     {
      //       price: dto.price,
      //     },
      //   ],
      // });
      // // Here we are using Prisma to create or update the subscription plan
      // const result = await this.prisma.subscriptionPlan.upsert({
      //   where: { type: dto.type },
      //   update: data,
      //   create: { ...dto },
      // });
      // return ApiResponse.success(
      //   result,
      //   'Subscription plan created successfully',
      // );
    } catch (err) {
      return ApiResponse.error(
        'Subscription failed',
        (err as Error).message ?? 'Unknown error',
      );
    }
  }

  async findAll() {
    // try {
    //   const result = await this.prisma.subscriptionPlan.findMany();
    //   return ApiResponse.success(
    //     result,
    //     'Subscription plans fetched successfully',
    //   );
    // } catch (err) {
    //   return ApiResponse.error('Subscription does not fetches', err.message);
    // }
  }

  async updatePlanByAdmin(planId: string, dto: UpdateSubscriptionplanDto) {
    // try {
    //   const { length, price, type } = dto;
    //   const isPlanExists = await this.prisma.subscriptionPlan.findUnique({
    //     where: {
    //       id: planId,
    //     },
    //   });
    //   if (!isPlanExists) {
    //     // amader to response banano hoise, oita use korei error throw kora hobe
    //     throw new BadRequestException('Plan can not found');
    //   }
    //   const result = await this.prisma.subscriptionPlan.update({
    //     where: {
    //       type,
    //     },
    //     data: {
    //       length,
    //       price,
    //       type,
    //     },
    //   });
    //   console.log(result, 'res');
    //   return ApiResponse.success(result, 'Plan Update successfully');
    // } catch (err) {
    //   // aikhane vol process error handle kora hoyeche
    //   return ApiResponse.error(err, 'Plan Update failed');
    // }
  }
}
