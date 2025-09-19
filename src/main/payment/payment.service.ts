/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { ApiResponse } from 'src/utils/common/apiresponse/apiresponse';
import { HelperService } from 'src/utils/helper/helper.service';
import Stripe from 'stripe';
import { SubscriptionPlanType } from './type/subscriptionPlanType';
import { MailService } from 'src/utils/mail/mail.service';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly helperService: HelperService,
    private readonly mailService: MailService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {});
  }

  async createCheckoutSession(
    userId: string,
    packageId: string,
    couponCode?: string,
  ) {
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

      if (!packageExists) {
        return ApiResponse.error('Package does not exist');
      }
      // 3. Check if the coupon exists in the database

      type Coupon = { stripeCouponId: string };
      let couponExists: Coupon[] = [];
      if (couponCode) {
        couponExists = (await this.helperService.couponExists(
          couponCode,
        )) as Coupon[];
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
        ...(couponExists.length > 0
          ? {
              discounts: [
                {
                  coupon: couponExists[0]?.stripeCouponId,
                },
              ],
            }
          : {}),

        // success_url: 'http://localhost:3000/stripe/payment-success',
        success_url: 'http://localhost:5173/payment-success',
        cancel_url: 'http://localhost:3000/stripe/payment-cancel',
      });
      return ApiResponse.success(
        { url: session.url },
        'Checkout session created successfully',
      );
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  }
  // Handle Stripe webhook events
  async handleWebhook(payload: Buffer, sig: string) {
    try {
      console.log('Webhook received');
      const event = this.stripe.webhooks.constructEvent(
        payload,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET as string,
      );
      console.log('1', { event });
      if (
        event.type === 'customer.subscription.created' ||
        event.type === 'customer.subscription.updated' ||
        event.type === 'invoice.payment_succeeded'
      ) {
        const subscriptionEventData = event.data.object as Stripe.Subscription;

        const invoiceDetails = await this.stripe.invoices.retrieve(
          subscriptionEventData?.latest_invoice as string,
        );
        console.log('2', { invoiceDetails });
        const planType = subscriptionEventData?.items?.data?.[0]?.price
          ?.metadata?.planType as string | undefined;

        if (!planType) {
          throw new Error('Plan type is missing in subscription metadata.');
        }

        const subscribedPlan =
          await this.prismaService.subscriptionPlan.findFirst({
            where: {
              type: planType as SubscriptionPlanType,
            },
          });

        if (!subscribedPlan) {
          return ApiResponse.error('Subscribed plan not found');
        }

        // Calculate start and expiry times
        const startTime = new Date(); // Current time
        const expiryTime = this.calculateExpiryTime(
          startTime,
          subscribedPlan.length,
        );

        // Validate that expiryTime is valid
        if (isNaN(expiryTime.getTime())) {
          throw new Error(
            `Invalid expiry time calculated from plan length: ${subscribedPlan.length}`,
          );
        }

        await this.prismaService.userSubscriptionValidity.upsert({
          where: { userId: subscriptionEventData.metadata.userId },
          update: {
            subscribedPlan: subscribedPlan.id,
            startTime: startTime,
            expiryTime: expiryTime,
            payabeAmount: (Number(invoiceDetails.amount_paid) / 100).toString(),
          },
          create: {
            userId: subscriptionEventData.metadata.userId,
            subscribedPlan: subscribedPlan.id,
            startTime: startTime,
            expiryTime: expiryTime,
            payabeAmount: (Number(invoiceDetails.amount_paid) / 100).toString(),
          },
        });

        await this.prismaService.amount.create({
          data: {
            invoiceNumber: invoiceDetails.number as string,
            amount: (Number(invoiceDetails.amount_paid) / 100).toString(),
          },
        });
        await this.mailService.sendReceiptEmail({
          to: subscriptionEventData.metadata.email,
          subject: 'Your Subscription Receipt',
          title: 'Subscription Activated',
          message: `Your subscription for the ${subscribedPlan.type} plan has been activated. It is valid until ${expiryTime.toDateString()}`,
          buttonText: 'View Invoice',
          buttonUrl: invoiceDetails.invoice_pdf as string,
          footerText: 'Thank you for subscribing to our service!',
        });
      }
      return ApiResponse.success('Subscription validity updated successfully');
    } catch (error) {
      console.error('Webhook error:', error.message);
      throw error;
    }
  }

  // Add this helper method to calculate expiry time
  private calculateExpiryTime(startTime: Date, planLength: string): Date {
    const expiryTime = new Date(startTime);

    // Parse the plan length (e.g., "80 days", "30 days", "12 months", "1 year")
    const lengthMatch = planLength.match(
      /(\d+)\s*(day|days|month|months|year|years)/i,
    );

    if (!lengthMatch) {
      // Try to parse as just a number (assume days)
      const numericLength = parseInt(planLength);
      if (!isNaN(numericLength)) {
        expiryTime.setDate(expiryTime.getDate() + numericLength);
        return expiryTime;
      }

      // Default to 30 days if parsing fails
      expiryTime.setDate(expiryTime.getDate() + 30);
      return expiryTime;
    }

    const amount = parseInt(lengthMatch[1]);
    const unit = lengthMatch[2].toLowerCase();

    console.log(`Parsed plan length: ${amount} ${unit}`);

    switch (unit) {
      case 'day':
      case 'days':
        expiryTime.setDate(expiryTime.getDate() + amount);
        break;
      case 'month':
      case 'months':
        expiryTime.setMonth(expiryTime.getMonth() + amount);
        break;
      case 'year':
      case 'years':
        expiryTime.setFullYear(expiryTime.getFullYear() + amount);
        break;
      default:
        // Default to days if unit is not recognized
        console.warn(`Unknown time unit: ${unit}, treating as days`);
        expiryTime.setDate(expiryTime.getDate() + amount);
    }

    return expiryTime;
  }
}
