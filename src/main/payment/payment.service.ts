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
      const customerid = await this.stripe.customers.list({
        email: userExists.email,
      });
      if (customerid.data.length === 0) {
        const stripeNewCustomer = await this.stripe.customers.create({
          email: userExists.email,
        });
      }

      // const session = await this.stripe.checkout.sessions.create({
      //   payment_method_types: ['card'],
      //   mode: 'subscription',
      //   customer: customerid.data[0].id,
      //   metadata: {
      //     email: userExists.email,
      //   },
      //   subscription_data: {
      //     metadata: {
      //       userId: userId,
      //       email: userExists.email,
      //     },
      //   },
      //   line_items: [
      //     {
      //       price: process.env.STRIPE_PRICE_ID as string,
      //       quantity: 1,
      //     },
      //   ],
      //   success_url: 'http://localhost:3000/stripe/payment-success',
      //   cancel_url: 'http://localhost:3000/stripe/payment-cancel',
      // });
      // console.log('Session created:', session);
      // return { url: session.url };
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
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription created or updated:', subscription);

        const metaData = subscription.metadata as {
          userId: string;
          email: string;
        };
        console.log('Metadata:', metaData);

        break;
      }

      case 'customer.subscription.deleted': {
        break;
      }
    }
  }
}
