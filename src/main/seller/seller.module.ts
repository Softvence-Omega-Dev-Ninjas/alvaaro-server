import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from 'src/utils/mail/mail.module';
import { HelperModule } from 'src/utils/helper/helper.module';

@Module({
  imports: [AuthModule, MailModule, HelperModule],
  controllers: [SellerController],
  providers: [SellerService],
})
export class SellerModule {}
