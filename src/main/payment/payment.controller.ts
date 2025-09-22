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
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('stripe')
export class PaymentController {
  constructor(private readonly stripeService: PaymentService) {}

  @Post('checkout')
  @UseGuards(AuthGuard)
  async checkout(
    @Req() req: Request,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    const packageId = createPaymentDto.packageId;
    const couponCode = createPaymentDto.couponCode;
    console.log(req['userid'] as string);
    return this.stripeService.createCheckoutSession(
      req['userid'] as string,
      packageId,
      couponCode,
    );
  }

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
