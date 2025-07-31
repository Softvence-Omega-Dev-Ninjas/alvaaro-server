import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { ApiResponse } from '../common/apiresponse/apiresponse';

@Injectable()
export class HelperService {
  constructor(private readonly prismaService: PrismaService) {}

  async userExists(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    return user;
  }

  async sellerExists(userId: string) {
    const seller = await this.prismaService.seller.findUnique({
      where: { userId },
      select: { id: true },
    });
    console.log('sellerExists', seller);
    if (!seller) {
      throw new Error('Seller does not exist');
    }
    return seller.id;
  }
  async packageExists(packageId: string) {
    const packageExists = await this.prismaService.subscriptionPlan.findUnique({
      where: { id: packageId },
    });
    if (!packageExists) {
      ApiResponse.error('Package does not exist');
    }
    return packageExists;
  }
  async couponExists(couponCode: string, percent_off: string) {
    const existingCoupon = await this.prismaService.coupon.findMany({
      where: {
        couponCode: couponCode,
        AND: [
          {
            couponCode: couponCode,
          },
          {
            percent_off: percent_off,
          },
        ],
      },
    });
    return existingCoupon;
  }
}
