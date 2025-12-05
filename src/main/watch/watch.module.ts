import { Module } from '@nestjs/common';
import { WatchService } from './watch.service';
import { WatchController } from './watch.controller';
import { ProductModule } from '../product/product.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ProductModule, AuthModule],
  controllers: [WatchController],
  providers: [WatchService],
})
export class WatchModule {}
