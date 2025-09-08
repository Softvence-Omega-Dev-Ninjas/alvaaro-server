import { Injectable } from '@nestjs/common';
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
    console.log(userExist);

    return ApiResponse.success(userExist, 'Current user found successfully');
  }
}
