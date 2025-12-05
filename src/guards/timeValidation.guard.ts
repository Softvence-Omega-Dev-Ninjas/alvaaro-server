import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma-service/prisma-service.service';

@Injectable()
export class TimeValidation implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userExists = await this.prisma.userSubscriptionValidity.findUnique({
      where: { userId: request.userid as string },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: request.userid as string },
    });
    if (!userExists || !userExists.id || !user) {
      throw new ForbiddenException('Unauthorized: No user found');
    }

    const subscriptionPlan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: userExists.subscribedPlan },
    });
    if (!subscriptionPlan) {
      throw new BadRequestException('Subscription plan not found');
    }

    if (subscriptionPlan.listingLimit <= user.accessLogs) {
      throw new BadRequestException('You have reached your listing limit');
    }
    const now = new Date();
    const endTime = new Date(userExists.expiryTime);

    if (now > endTime) {
      throw new BadRequestException(
        'Subscription period has ended. Please renew your plan to continue.',
      );
    }

    return true;
  }
}
