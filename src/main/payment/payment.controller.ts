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
  constructor(private readonly stripeService: PaymentService) { }

  // * Routes for Stripe Checkout
  @UseGuards(AuthGuard)
  @Post('checkout')
  async checkout(
    @Req() req: { userid: string },
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    const userId = req.userid;
    const packageId = createPaymentDto.packageId;
    const couponCode = createPaymentDto.couponCode;

    return this.stripeService.createCheckoutSession(
      userId,
      packageId,
      couponCode,
    );
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
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') sig: string,
  ) {
    try {
      await this.stripeService.handleWebhook(req.body, sig);
      return { received: true };
    } catch (err) {
      return { error: 'Webhook Error' };
    }
  }
}
