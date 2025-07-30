import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { HelperModule } from 'src/utils/helper/helper.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [HelperModule],
  controllers: [PaymentController],
  providers: [PaymentService, JwtService],
})
export class PaymentModule {}
