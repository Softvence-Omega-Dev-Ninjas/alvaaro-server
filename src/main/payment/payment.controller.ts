import {
  Body,
  Controller,
  Post,
  RawBodyRequest,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { SaveSessionDto } from './dto/update-payment.dto';
import { Public } from 'src/guards/public.decorator';

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
    return this.stripeService.createCheckoutSession(
      req['userid'] as string,
      packageId,
      couponCode,
    );
  }

  @Post('save-session')
  @UseGuards(AuthGuard)
  async saveSession(@Body() data: SaveSessionDto, @Req() req: Request) {
    return await this.stripeService.saveSession(data, req['userid'] as string);
  }

  @Post('cancel-subscription')
  @UseGuards(AuthGuard)
  async cancelSubscription(@Req() req: Request) {
    return await this.stripeService.cancelSubscription(
      req['userid'] as string,
    );
  }

  @Public()
  @Post('webhook')
  async webhook(
    // @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    // console.log({ req });
    return await this.stripeService.handleWebhook(req);
  }
}
