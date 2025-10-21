import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma-service/prisma-service.service';

@Injectable()
export class TimeValidation implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userExists = await this.prisma.userSubscriptionValidity.findUnique({
      where: { userId: request.userid as string },
    });
    if (!userExists || !userExists.id) {
      throw new ForbiddenException('Unauthorized: No user found');
    }

    const now = new Date();
    const endTime = new Date(userExists.expiryTime);

    if (now > endTime) {
      throw new BadRequestException(
        'Subscription period has ended. Please renew your plan to continue.',
      );
    }

    return true; // allow access
  }
}
