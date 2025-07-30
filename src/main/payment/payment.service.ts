import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { ApiResponse } from 'src/utils/common/apiresponse/apiresponse';
import { HelperService } from 'src/utils/helper/helper.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private readonly prismaService: PrismaService,

    private readonly helperService: HelperService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {});
  }

  async createCheckoutSession(userId: string, packageId: string) {
    try {
      //
      // 1. Check if the user exists in the database
      const userExists = await this.helperService.userExists(userId);
      if (!userExists) {
        return ApiResponse.error('User does not exist');
      }
      //  1. customer find in stripe
      const customerinStripe = await this.stripe.customers.search({
        query: `email:'${userExists.email}'`,
      });
      let customerId: string;
      if (customerinStripe.data.length === 0) {
        const stripeNewCustomer = await this.stripe.customers.create({
          email: userExists.email,
        });
        customerId = stripeNewCustomer.id;
      } else {
        customerId = customerinStripe.data[0].id;
      }
      // 2. Check if the package exists in the database
      const packageExists = await this.helperService.packageExists(packageId);
      console.log('Package Exists:', packageExists);
      if (!packageExists) {
        return ApiResponse.error('Package does not exist');
      }
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        customer: customerId,
        metadata: {
          email: userExists.email,
        },
        subscription_data: {
          metadata: {
            userId: userId,
            email: userExists.email,
          },
        },
        line_items: [
          {
            price: packageExists.stripePriceId,
            quantity: 1,
          },
        ],
        success_url: 'http://localhost:3000/stripe/payment-success',
        cancel_url: 'http://localhost:3000/stripe/payment-cancel',
      });
      console.log('Session created:', session);
      return { url: session.url };
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  }
  // Handle Stripe webhook events
  async handleWebhook(payload: Buffer, sig: string) {
    const event = await this.stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
    console.log('Webhook event received:', event.data.object);
  }
}
