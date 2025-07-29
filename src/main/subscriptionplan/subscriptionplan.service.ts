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
    console.log('Creating subscription plan:', dto);

    let stripeProductId: string | null = null;
    let stripePriceId: string | null = null;

    try {
      // Use Prisma transaction for database operations
      const result = await this.prisma.$transaction(async (prisma) => {
        // Check if subscription plan already exists
        const existingPlan = await prisma.subscriptionPlan.findUnique({
          where: { type: dto.type },
        });

        if (existingPlan) {
          throw new Error('Subscription plan with this type already exists');
        }

        // Step 1: Create Stripe product
        const product = await this.stripe.products.create({
          name: dto.type,
          description: `${dto.type} subscription plan`,
          metadata: {
            planType: dto.type,
            features: dto.features?.join(',') || '',
          },
        });
        stripeProductId = product.id;

        // Step 2: Create Stripe price
        const price = await this.stripe.prices.create({
          currency: 'usd',
          unit_amount: dto.price ? parseFloat(dto.price) * 100 : 0,
          product: product.id,
          recurring: {
            interval: 'month',
            interval_count: 1,
          },
          metadata: {
            planType: dto.type,
          },
        });
        stripePriceId = price.id;

        // Step 3: Create database record
        const subscriptionPlan = await prisma.subscriptionPlan.create({
          data: {
            type: dto.type,
            price: dto.price,
            length: dto.length, // Ensure dto.length is provided in CreateSubscriptionPlanDto
            features: dto.features || [],
            stripeProductId: product.id,
            stripePriceId: price.id,
          },
        });

        return {
          subscriptionPlan,
          stripeProduct: product,
          stripePrice: price,
        };
      });

      return ApiResponse.success(
        result.subscriptionPlan,
        'Subscription plan created successfully',
      );
    } catch (error) {
      console.error('Error creating subscription plan:', error.message);

      // Rollback Stripe resources if created
      try {
        if (stripePriceId) {
          await this.stripe.prices.update(stripePriceId, { active: false });
          console.log(`Deactivated Stripe price: ${stripePriceId}`);
        }
        if (stripeProductId) {
          await this.stripe.products.update(stripeProductId, { active: false });
          console.log(`Deactivated Stripe product: ${stripeProductId}`);
        }
      } catch (rollbackError) {
        console.error(
          'Failed to rollback Stripe resources:',
          rollbackError.message,
        );
      }

      return ApiResponse.error(
        'Failed to create subscription plan',
        error.message,
      );
    }
  }

  // async findAll() {
  //   try {
  //     const plans = await this.prisma.subscriptionPlan.findMany({
  //       where: { isActive: true },
  //       orderBy: { createdAt: 'desc' },
  //     });

  //     // Enrich with Stripe data
  //     const enrichedPlans = await Promise.all(
  //       plans.map(async (plan) => {
  //         try {
  //           const [product, price] = await Promise.all([
  //             this.stripe.products.retrieve(plan.stripeProductId),
  //             this.stripe.prices.retrieve(plan.stripePriceId),
  //           ]);

  //           return {
  //             ...plan,
  //             stripeProduct: product,
  //             stripePrice: price,
  //           };
  //         } catch (stripeError) {
  //           console.error(
  //             `Error fetching Stripe data for plan ${plan.id}:`,
  //             stripeError.message,
  //           );
  //           return plan; // Return plan without Stripe data if error
  //         }
  //       }),
  //     );

  //     return ApiResponse.success(
  //       enrichedPlans,
  //       'Subscription plans fetched successfully',
  //     );
  //   } catch (error) {
  //     console.error('Error fetching subscription plans:', error.message);
  //     return ApiResponse.error(
  //       'Failed to fetch subscription plans',
  //       error.message,
  //     );
  //   }
  // }

  // async updatePlanByAdmin(planId: string, dto: UpdateSubscriptionplanDto) {
  //   let originalPlan: any = null;

  //   try {
  //     return await this.prisma.$transaction(async (prisma) => {
  //       // Get existing plan
  //       const existingPlan = await prisma.subscriptionPlan.findUnique({
  //         where: { id: planId },
  //       });

  //       if (!existingPlan) {
  //         throw new BadRequestException('Subscription plan not found');
  //       }

  //       originalPlan = existingPlan;

  //       // Update Stripe product if name changed
  //       if (dto.type && dto.type !== existingPlan.type) {
  //         await this.stripe.products.update(existingPlan.stripeProductId, {
  //           name: dto.type,
  //           description: `${dto.type} subscription plan`,
  //         });
  //       }

  //       // Create new price if price changed (Stripe prices are immutable)
  //       let newStripePriceId = existingPlan.stripePriceId;
  //       if (
  //         dto.price &&
  //         parseFloat(dto.price) !== parseFloat(existingPlan.price)
  //       ) {
  //         const newPrice = await this.stripe.prices.create({
  //           currency: 'usd',
  //           unit_amount: parseFloat(dto.price) * 100,
  //           product: existingPlan.stripeProductId,
  //           recurring: {
  //             interval: dto.interval || 'month',
  //             interval_count: dto.intervalCount || 1,
  //           },
  //         });

  //         // Deactivate old price
  //         await this.stripe.prices.update(existingPlan.stripePriceId, {
  //           active: false,
  //         });

  //         newStripePriceId = newPrice.id;
  //       }

  //       // Update database record
  //       const updatedPlan = await prisma.subscriptionPlan.update({
  //         where: { id: planId },
  //         data: {
  //           type: dto.type || existingPlan.type,
  //           price: dto.price || existingPlan.price,
  //           length: dto.length || existingPlan.length,
  //           features: dto.features || existingPlan.features,
  //           stripePriceId: newStripePriceId,
  //           updatedAt: new Date(),
  //         },
  //       });

  //       return updatedPlan;
  //     });
  //   } catch (error) {
  //     console.error('Error updating subscription plan:', error.message);

  //     // Rollback logic if needed
  //     if (originalPlan && error.message.includes('Stripe')) {
  //       console.log('Attempting to rollback Stripe changes...');
  //       // Additional rollback logic can be added here
  //     }

  //     if (error instanceof BadRequestException) {
  //       throw error;
  //     }

  //     return ApiResponse.error(
  //       'Failed to update subscription plan',
  //       error.message,
  //     );
  //   }
  // }

  // async deletePlan(planId: string) {
  //   try {
  //     return await this.prisma.$transaction(async (prisma) => {
  //       const plan = await prisma.subscriptionPlan.findUnique({
  //         where: { id: planId },
  //       });

  //       if (!plan) {
  //         throw new BadRequestException('Subscription plan not found');
  //       }

  //       // Deactivate Stripe resources instead of deleting
  //       await Promise.all([
  //         this.stripe.prices.update(plan.stripePriceId, { active: false }),
  //         this.stripe.products.update(plan.stripeProductId, { active: false }),
  //       ]);

  //       // Soft delete in database
  //       const deletedPlan = await prisma.subscriptionPlan.update({
  //         where: { id: planId },
  //         data: { isActive: false, deletedAt: new Date() },
  //       });

  //       return ApiResponse.success(
  //         deletedPlan,
  //         'Subscription plan deleted successfully',
  //       );
  //     });
  //   } catch (error) {
  //     console.error('Error deleting subscription plan:', error.message);
  //     return ApiResponse.error(
  //       'Failed to delete subscription plan',
  //       error.message,
  //     );
  //   }
  // }

  // async createSubscriptionForCustomer(customerId: string, priceId: string) {
  //   try {
  //     const subscription = await this.stripe.subscriptions.create({
  //       customer: customerId,
  //       items: [{ price: priceId }],
  //       payment_behavior: 'default_incomplete',
  //       payment_settings: { save_default_payment_method: 'on_subscription' },
  //       expand: ['latest_invoice.payment_intent'],
  //     });

  //     return ApiResponse.success(
  //       subscription,
  //       'Subscription created successfully',
  //     );
  //   } catch (error) {
  //     console.error('Error creating subscription:', error.message);
  //     return ApiResponse.error('Failed to create subscription', error.message);
  //   }
  // }
}
