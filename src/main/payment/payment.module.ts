import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { HelperModule } from 'src/utils/helper/helper.module';

@Module({
  imports: [HelperModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
