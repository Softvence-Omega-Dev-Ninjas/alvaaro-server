import { Module } from '@nestjs/common';
import { TiktokAuthService } from './services/tiktok-auth.service';
import { TiktokAuthController } from './controller/tiktok-auth.controller';
import { HttpModule } from '@nestjs/axios';
import { TiktokController } from './controller/tiktok.controller';
import { TiktokService } from './services/tiktok.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [HttpModule, JwtModule],
  controllers: [TiktokAuthController, TiktokController],
  providers: [TiktokAuthService, TiktokAuthService, TiktokService],
})
export class TiktokModule {}
