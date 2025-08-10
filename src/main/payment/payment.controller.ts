// src/stripe/stripe.controller.ts
import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  RawBodyRequest,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('stripe')
export class PaymentController {
  constructor(private readonly stripeService: PaymentService) {}

  // ! Routes for Stripe Checkout
  @UseGuards(AuthGuard)
  @Post('checkout')
  async checkout(
    @Req() req: { userid: string },
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    const userId = req.userid;
    const packageId = createPaymentDto.packageId;
    const couponCode = createPaymentDto.couponCode;
    console.log('User ID:', userId);
    return this.stripeService.createCheckoutSession(
      userId,
      packageId,
      couponCode,
    );
  }

  // ! Routes for Payment Success
  @Get('payment-success')
  paymentSuccess(@Res() res: Response) {
    return res.send(
      '<h1>Payment Successful!</h1><p>Thank you for your purchase.</p>',
    );
  }

  // ! Routes for Payment Cancel
  @Get('payment-cancel')
  paymentCancel(@Res() res: Response) {
    return res.send(
      '<h1>Payment Cancelled</h1><p>Your payment was cancelled.</p>',
    );
  }

  // ! Routes for Webhook
  @Post('webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') sig: string,
  ) {
    try {
      console.log('Received webhook event:', sig);
      await this.stripeService.handleWebhook(req.body, sig);
      return { received: true };
    } catch (err) {
      console.error('Webhook error:', err);
      return { error: 'Webhook Error' };
    }
  }
}
