import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { ApiResponse } from 'src/utils/common/apiresponse/apiresponse';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }
  async findAll() {
    const users = await this.prisma.user.findMany();

    return ApiResponse.success(users, 'Users retrieved successfully');
  }




  // find current user
  async findCurrentUser(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    return ApiResponse.success(user, 'Current user found successfully');
  }
}
