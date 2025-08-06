import { Module } from '@nestjs/common';
import { TiktokAuthService } from './services/tiktok-auth.service';
import { TiktokAuthController } from './controller/tiktok-auth.controller';

@Module({
  controllers: [TiktokAuthController],
  providers: [TiktokAuthService, TiktokAuthService],
})
export class TiktokModule {}
