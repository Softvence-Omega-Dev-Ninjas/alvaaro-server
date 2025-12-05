import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { HelperModule } from 'src/utils/helper/helper.module';
import { JwtService } from '@nestjs/jwt';
import { MailModule } from 'src/utils/mail/mail.module';

@Module({
  imports: [HelperModule, MailModule],
  controllers: [PaymentController],
  providers: [PaymentService, JwtService],
})
export class PaymentModule {}
