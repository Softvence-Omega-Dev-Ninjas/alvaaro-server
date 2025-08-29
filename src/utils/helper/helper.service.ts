import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { ApiResponse } from '../common/apiresponse/apiresponse';

@Injectable()
export class HelperService {
  constructor(private readonly prismaService: PrismaService) { }

  async userExists(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    return user;
  }

  async sellerExists(userId: string) {
    const seller = await this.prismaService.seller.findUnique({
      where: { userId, verificationStatus: 'VERIFIED' },
      select: { id: true },
    });

    if (!seller) {
      throw new HttpException('You Are not Verified From Admin', 403);
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
  async couponExists(couponCode: string) {
    const existingCoupon = await this.prismaService.coupon.findMany({
      where: {
        couponCode: couponCode,
      },
    });
    return existingCoupon;
  }
  getLocalDateTime(minutesToAdd: number) {
    const now = new Date();

    // Add minutes
    now.setMinutes(now.getMinutes() + minutesToAdd);

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}
