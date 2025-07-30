// src/stripe/stripe.controller.ts
import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('stripe')
export class PaymentController {
  constructor(private readonly stripeService: PaymentService) {}

  // * Routes for Stripe Checkout
  @UseGuards(AuthGuard)
  @Post('checkout')
  async checkout(
    @Req() req: { userid: string } & { body: { packageId: string } },
    @Body('packageId') packageId: string,
  ) {
    const userId = req.userid;
    console.log('User ID:', userId);
    return this.stripeService.createCheckoutSession(userId, packageId);
  }

  @Get('payment-success')
  paymentSuccess(@Res() res: Response) {
    return res.send(
      '<h1>Payment Successful!</h1><p>Thank you for your purchase.</p>',
    );
  }

  @Get('payment-cancel')
  paymentCancel(@Res() res: Response) {
    return res.send(
      '<h1>Payment Cancelled</h1><p>Your payment was cancelled.</p>',
    );
  }

  // * Webhook
  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') sig: string,
  ) {
    try {
      await this.stripeService.handleWebhook(req.body, sig);
    } catch (err) {
      console.error('Webhook error:', err);
    }
  }
}
