import { Module } from '@nestjs/common';
import { YachtService } from './yacht.service';
import { YachtController } from './yacht.controller';
import { ProductModule } from '../product/product.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ProductModule, AuthModule],
  controllers: [YachtController],
  providers: [YachtService],
})
export class YachtModule {}
