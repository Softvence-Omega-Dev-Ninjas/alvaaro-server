/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
      const amounts = await this.prisma.amount.findMany({});
      // total amount
      const totalAmount = amounts.reduce(
        (acc, curr) => acc + parseFloat(curr.amount),
        0,
      );

      const grouped = amounts.reduce(
        (acc, curr) => {
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
        { data, totalAmount },
        'Total amount monthwise fetched successfully',
      );
    } catch (error) {
      return ApiResponse.error('Total amount monthwise is not implemented yet');
    }
  }
  // find new sellers
  async findNewSellers() {
    try {
      // Fetch new sellers who have been added in the running month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);

      const newSellers = await this.prisma.seller.findMany({
        where: {
          createdAt: {
            gte: startOfMonth,
          },
        },
      });
      //
      // find total sellers
      const totalSellers = await this.prisma.seller.count({});
      return ApiResponse.success(
        { newSellers: newSellers.length, totalSellers },
        'New sellers fetched successfully',
      );
    } catch (error) {
      return ApiResponse.error('Error fetching new sellers');
    }
  }
  // seller verification by admin
  async verifySeller(id: string) {
    try {
      // Verify seller by id
      const updatedSeller = await this.prisma.seller.update({
        where: { id },
        data: { verificationStatus: 'VERIFIED' },
      });
      return ApiResponse.success(updatedSeller, 'Seller verified successfully');
    } catch (error) {
      return ApiResponse.error('Error verifying seller');
    }
  }
}
