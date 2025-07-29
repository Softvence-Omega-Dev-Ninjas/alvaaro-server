/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { CreateSubscriptionPlanDto } from './dto/create-subscriptionplan.dto';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { ApiResponse } from 'src/utils/common/apiresponse/apiresponse';
import Stripe from 'stripe';

@Injectable()
export class SubscriptionplanService {
  private stripe: Stripe;

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {});
  }

  async createSubscription(dto: CreateSubscriptionPlanDto) {
    console.log('Creating subscription plan:', dto);

    try {
      // Step 1: Check if plan already exists
      const existingPlan = await this.prisma.subscriptionPlan.findUnique({
        where: { type: dto.type },
      });

      if (existingPlan) {
        return ApiResponse.error(
          `Subscription plan with this ${dto.type} type already exists`,
        );
      }

      // Step 2: Create Stripe product
      const stripeProduct = await this.stripe.products.create({
        name: dto.type,
        description: `${dto.type} subscription plan`,
        metadata: {
          planType: dto.type,
          features: dto.features?.join(',') || '',
        },
      });

      // Step 3: Create Stripe price
      const stripePrice = await this.stripe.prices.create({
        currency: 'usd',
        unit_amount: dto.price ? Math.floor(parseFloat(dto.price) * 100) : 0,
        product: stripeProduct.id,
        recurring: {
          interval: 'month',
          interval_count: 1,
        },
        metadata: {
          planType: dto.type,
        },
      });

      // Step 4: Use Prisma transaction to create DB record
      const subscriptionPlan = await this.prisma.$transaction(async (tx) => {
        return await tx.subscriptionPlan.create({
          data: {
            type: dto.type,
            price: dto.price,
            length: dto.length,
            features: dto.features || [],
            stripeProductId: stripeProduct.id,
            stripePriceId: stripePrice.id,
          },
        });
      });

      return ApiResponse.success(
        subscriptionPlan,
        'Subscription plan created successfully',
      );
    } catch (error) {
      console.error('Error creating subscription plan:', error.message);

      return ApiResponse.error(
        'Failed to create subscription plan',
        error.message,
      );
    }
  }

  async findAll() {
    try {
      const plans = await this.prisma.subscriptionPlan.findMany({
        orderBy: { price: 'asc' },
        select: {
          id: true,
          type: true,
          price: true,
          length: true,
          features: true,
          stripeProductId: false,
          stripePriceId: false,
          createdAt: false,
          updatedAt: false,
        },
      });

      return ApiResponse.success(
        plans,
        'Subscription plans fetched successfully',
      );
    } catch (error) {
      console.error('Error fetching subscription plans:', error.message);
      return ApiResponse.error(
        'Failed to fetch subscription plans',
        error.message,
      );
    }
  }

  async deletePlan(planId: string) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const plan = await prisma.subscriptionPlan.findUnique({
          where: { id: planId },
        });
        if (!plan) {
          return ApiResponse.error('Subscription plan not found');
        }
        await this.stripe.prices.update(plan.stripePriceId, {
          active: false,
        });
        await this.stripe.products.update(plan.stripeProductId, {
          active: false,
        });

        const deletedPlan = await prisma.subscriptionPlan.delete({
          where: { id: planId },
        });

        return ApiResponse.success(
          deletedPlan,
          'Subscription plan deleted successfully',
        );
      });
    } catch (error) {
      return ApiResponse.error(
        'Failed to delete subscription plan',
        error.message,
      );
    }
  }
}
