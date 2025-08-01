import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { HelperModule } from 'src/utils/helper/helper.module';
import { AuthModule } from '../auth/auth.module';
import { ProductService } from './product.service';

@Module({
  imports: [HelperModule, AuthModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
