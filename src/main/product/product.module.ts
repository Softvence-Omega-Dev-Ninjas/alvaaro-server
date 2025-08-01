import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { HelperModule } from 'src/utils/helper/helper.module';
import { AuthModule } from '../auth/auth.module';
import { ProductService } from './product.service';
import { MailModule } from 'src/utils/mail/mail.module';

@Module({
  imports: [HelperModule, AuthModule, MailModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
