import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { ApiResponse } from 'src/utils/common/apiresponse/apiresponse';

@Injectable()
export class TimeValidation implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userExists = await this.prisma.userSubscriptionValidity.findUnique({
      where: { userId: request.userid },
    });
    if (!userExists || !userExists.id) {
      throw new ForbiddenException('Unauthorized: No user found');
    }

    const now = new Date();
    const endTime = new Date(userExists.expiryTime);

    if (now > endTime) {
      throw new BadRequestException('Subscription plan has expired');
    }

    return true; // allow access
  }
}
