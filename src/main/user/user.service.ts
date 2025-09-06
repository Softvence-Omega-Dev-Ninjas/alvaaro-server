import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { ApiResponse } from 'src/utils/common/apiresponse/apiresponse';
import { HelperService } from 'src/utils/helper/helper.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helper: HelperService,
  ) {}
  async findAll() {
    const users = await this.prisma.user.findMany();

    return ApiResponse.success(users, 'Users retrieved successfully');
  }

  // find current user
  async findCurrentUser(userId: string) {
    const userExist = await this.helper.userExists(userId);
    if (!userExist) {
      throw new NotFoundException('User does not exist');
    }
    if (userExist.role === 'SELLER') {
      const sellerDetails = await this.prisma.seller.findUnique({
        where: { userId: userId },
      });
      return ApiResponse.success(
        { ...userExist, sellerId: sellerDetails?.id },
        'Current user found successfully',
      );
    }

    return ApiResponse.success(userExist, 'Current user found successfully');
  }
}
