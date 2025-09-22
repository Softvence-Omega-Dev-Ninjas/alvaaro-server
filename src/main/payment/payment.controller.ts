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
import { Public } from 'src/guards/public.decorator';

@Controller('stripe')
export class PaymentController {
  constructor(private readonly stripeService: PaymentService) {}

  @Post('checkout')
  @Public()
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

  // * Webhook
  @Post('webhook')
  @Public()
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') sig: string,
  ) {
    try {
      await this.stripeService.handleWebhook(req.body, sig);
      return { received: true };
    } catch (err) {
      return { error: 'Webhook Error', details: err };
    }
  }
}
