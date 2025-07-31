import { Module } from '@nestjs/common';
import { JewelleryService } from './jwellery.service';
import { JwelleryController } from './jwellery.controller';
import { ProductModule } from '../product/product.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ProductModule, AuthModule],
  controllers: [JwelleryController],
  providers: [JewelleryService],
})
export class JwelleryModule {}
