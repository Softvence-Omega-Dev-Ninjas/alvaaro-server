import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
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

  async createCheckoutSession(userId: string) {
    try {
      //
      // 1. Check if the user exists in the database
      // const userExists = await this.helperService.userExists(userId);
      // if (!userExists) {
      //   throw new Error('User does not exist');
      // }
      //  1. customer find in stripe
      // const customer = await this.stripe.customers.list({
      //   email: email || 'shanto@example.com',
      // });
      // if (customer.data.length === 0) {
      //   // 2. if customer not found then create a new customer
      //   const newCustomer = await this.stripe.customers.create({
      //     email: email || 'shanto@example.com',
      //   });
      //   console.log('New customer created:', newCustomer);
      // }
      // 3. create a checkout session with the customer id
      // const customerById = await this.stripe.customers.retrieve(
      //   process.env.STRIPE_CUSTOMER_ID as string,
      // );
      // console.log('costomerId:', await this.stripe.customers.retrieve(process.env.STRIPE_CUSTOMER_ID as string));
      // const session = await this.stripe.checkout.sessions.create({
      //   payment_method_types: ['card'],
      //   mode: 'subscription',
      //   customer: customerById.id,
      //   metadata: {
      //     userId: userId || '12345',
      //     email: email || 'shanto@example.com',
      //   },
      //   subscription_data: {
      //     metadata: {
      //       userId: userId || '12345',
      //       email: email || 'shanto@example.com',
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
