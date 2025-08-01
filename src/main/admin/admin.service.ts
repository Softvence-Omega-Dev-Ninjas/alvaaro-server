import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { ApiResponse } from 'src/utils/common/apiresponse/apiresponse';

type UserSearchPayload = {
  v_status?: 'PENDING' | 'VERIFIED' | 'REJECTED'; // optional if you want it flexible
  s_status?: string; // also optional
  fullName?: string;
  email?: string;
};

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // find all sellers by status and verification status
  async findAllSellers(payload: UserSearchPayload) {
    try {
      const userFilters: any[] = [];

      if (payload.fullName) {
        userFilters.push({
          fullName: {
            contains: payload.fullName,
            mode: 'insensitive',
          },
        });
      }

      if (payload.email) {
        userFilters.push({
          email: {
            contains: payload.email,
            mode: 'insensitive',
          },
        });
      }
      console.log(payload);
      return await this.prisma.seller.findMany({
        where: {
          subscriptionStatus: payload.s_status === 'active',
          verificationStatus: payload.v_status,
          user: {
            OR: userFilters,
          },
        },
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      ApiResponse.error(
        'Error fetching sellers',
        error.message || 'Internal Server Error',
      );
    }
  }

  // find all users and sellers
  async findAllUsersAndSellers() {
    try {
      // Fetch all users and sellers count
      const users = await this.prisma.user.findMany();
      const sellers = await this.prisma.seller.findMany({
        where: {
          verificationStatus: 'VERIFIED',
          subscriptionStatus: true,
        },
      });

      return ApiResponse.success(
        {
          users: users.length,
          sellers: sellers.length,
        },
        'Users and Sellers fetched successfully',
      );
    } catch (error) {
      throw new Error('Error fetching users and sellers');
    }
  }
}
