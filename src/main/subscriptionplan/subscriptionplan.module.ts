import { Module } from '@nestjs/common';
import { SubscriptionplanService } from './subscriptionplan.service';
import { SubscriptionplanController } from './subscriptionplan.controller';
import { PrismaModule } from 'src/prisma-service/prisma-service.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [SubscriptionplanController],
  providers: [SubscriptionplanService],
})
export class SubscriptionplanModule {}
