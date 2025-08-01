/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
  // get total amount monthwise
  async findTotalAmount() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const amounts = await this.prisma.amount.findMany({});
      console.log(amounts);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const grouped = amounts.reduce(
        (acc, curr) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          const month = curr.createdAt.toISOString().slice(0, 7); // e.g. '2025-08'
          const amountNum = parseFloat(curr.amount);

          acc[month] = (acc[month] || 0) + amountNum;
          return acc;
        },
        {} as Record<string, number>,
      );

      const data = Object.entries(grouped).map(([month, totalAmount]) => ({
        month,
        totalAmount,
      }));
      return ApiResponse.success(
        data,
        'Total amount monthwise fetched successfully',
      );
    } catch (error) {
      return ApiResponse.error('Total amount monthwise is not implemented yet');
    }
  }
}
