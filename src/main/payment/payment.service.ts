import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  RawBodyRequest,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { ApiResponse } from 'src/utils/common/apiresponse/apiresponse';
import { HelperService } from 'src/utils/helper/helper.service';
import { MailService } from 'src/utils/mail/mail.service';
import Stripe from 'stripe';
import { SaveSessionDto } from './dto/update-payment.dto';
import { SubscriptionPlanType } from './type/subscriptionPlanType';
import { Request } from 'express';
import { subscriptionPurchaseTemplate } from 'src/utils/mail/templates/subscription-purchase.template';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly helperService: HelperService,
    private readonly mailService: MailService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  }

  async createCheckoutSession(
    userId: string,
    packageId: string,
    couponCode?: string,
  ) {
    try {
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
        success_url:
          'https://priveestate.es/auth/payment-success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'https://priveestate.es/auth/stripe/payment-cancel',
      });
      return ApiResponse.success(
        { url: session.url },
        'Checkout session created successfully',
      );
    } catch (error) {
      return ApiResponse.error(
        'Failed to create checkout session',
        error.message,
      );
    }
  }
  //
  async saveSession(data: SaveSessionDto, userId: string) {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(
        data.sessionId,
        {
          expand: ['payment_intent', 'subscription'],
        },
      );
      if (!session) {
        throw new ForbiddenException('Session not found');
      }
      if (session.payment_status === 'paid') {
        const subscriptionEventData = session;
        const invoiceDetails = await this.stripe.invoices.retrieve(
          (session.subscription as Stripe.Subscription)
            ?.latest_invoice as string,
        );
        const subscription = session.subscription as Stripe.Subscription;
        const planType = subscription?.items?.data?.[0]?.price?.metadata
          ?.planType as string | undefined;

        if (!planType) {
          throw new ForbiddenException(
            'Plan type is missing in subscription metadata.',
          );
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
          throw new BadRequestException(
            `Invalid expiry time calculated from plan length: ${subscribedPlan.length}`,
          );
        }

        if (!subscriptionEventData.metadata) {
          throw new BadRequestException('Subscription metadata is missing.');
        }
        await this.prismaService.userSubscriptionValidity.upsert({
          where: { userId: userId },
          update: {
            subscribedPlan: subscribedPlan.id,
            startTime: startTime,
            expiryTime: expiryTime,
            payableAmount: (
              Number(invoiceDetails.amount_paid) / 100
            ).toString(),
          },
          create: {
            userId: userId,
            subscribedPlan: subscribedPlan.id,
            startTime: startTime,
            expiryTime: expiryTime,
            payableAmount: (
              Number(invoiceDetails.amount_paid) / 100
            ).toString(),
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
      throw new ForbiddenException(error.message, 'Failed to retrieve session');
    }
  }

  async handleWebhook(req: RawBodyRequest<Request>) {
    const signature = req.headers['stripe-signature'] as string;
    const rawBody = req.rawBody;
    if (!rawBody) {
      throw new BadRequestException('No webhook payload was provided.');
    }

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_KEY as string,
      );
    } catch {
      throw new BadRequestException('Invalid Stripe signature');
    }

    // {
    //   email: 'shantohmmm@gmail.com',
    //   userId: '471ad381-5d94-403b-b686-de1ed8e3b000'
    // }
    switch (event.type) {
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const metadata = invoice.parent?.subscription_details?.metadata;
        const email = metadata?.email as string;
        const invoiceUrl = invoice.hosted_invoice_url as string;
        const subscriptionId = invoice.parent?.subscription_details
          ?.subscription as string;

        if (!subscriptionId) {
          console.warn('⚠️ No subscription ID found in invoice.');
          break;
        }

        // Fetch subscription details
        const subscription = await this.stripe.subscriptions.retrieve(
          subscriptionId,
          {
            expand: ['latest_invoice', 'items.data.price.product'],
          },
        );

        const subscriptionData = subscription.items.data;
        const startDate = new Date(
          subscriptionData[0].current_period_start * 1000,
        );
        const endDate = new Date(subscriptionData[0].current_period_end * 1000);
        const userId = subscription.metadata?.userId;

        if (!userId) {
          console.warn('⚠️ No userId found in subscription metadata');
          break;
        }

        await this.prismaService.userSubscriptionValidity.upsert({
          where: { userId },
          update: {
            startTime: startDate,
            expiryTime: endDate,
            subscribedPlan: subscription.items.data[0]?.price?.id || 'unknown',
            payableAmount: `${invoice.amount_paid / 100}`,
          },
          create: {
            userId,
            startTime: startDate,
            expiryTime: endDate,
            subscribedPlan: subscription.items.data[0]?.price?.id || 'unknown',
            payableAmount: `${invoice.amount_paid / 100}`,
          },
        });

        // Send email to customer
        const emailSubject = 'Your Subscription Payment Was Successful!';
        const mail = await this.mailService.sendMail(
          email,
          emailSubject,
          subscriptionPurchaseTemplate(
            email,
            subscription,
            invoice,
            startDate,
            endDate,
            invoiceUrl,
          ),
        );
        console.log('mail', mail);

        console.log(
          `✅ Subscription renewed for user ${userId}, valid until ${endDate.toISOString()}`,
        );
        break;
      }

      case 'invoice.payment_failed': {
        console.log('⚠️ Subscription renewal failed');
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true, type: event.type };
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
