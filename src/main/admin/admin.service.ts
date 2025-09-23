import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { ApiResponse } from 'src/utils/common/apiresponse/apiresponse';
import { HelperService } from 'src/utils/helper/helper.service';
import { VerificationStatusDto } from './dto/verficationStatus.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';

type UserSearchPayload = {
  v_status?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  s_status?: 'true' | 'false';
  fullName?: string;
  email?: string;
};

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helper: HelperService,
  ) {}

  // find all sellers by status and verification status
  async findAllSellers(payload: UserSearchPayload) {
    let subscriptionFilter: boolean | undefined = undefined;
    if (payload?.s_status) {
      subscriptionFilter =
        payload.s_status.toLowerCase() === 'active'
          ? true
          : payload.s_status.toLowerCase() === 'inactive'
            ? false
            : undefined;
    }

    let verificationFilter: 'PENDING' | 'VERIFIED' | 'REJECTED' | undefined =
      undefined;
    if (payload?.v_status) {
      verificationFilter =
        payload.v_status.toUpperCase() === 'PENDING'
          ? 'PENDING'
          : payload.v_status.toUpperCase() === 'VERIFIED'
            ? 'VERIFIED'
            : payload.v_status.toUpperCase() === 'REJECTED'
              ? 'REJECTED'
              : undefined;
    }

    const getData = await this.prisma.seller.findMany({
      where: {
        user: {
          fullName: {
            contains: payload.fullName || '',
            mode: 'insensitive',
          },
          email: {
            contains: payload.email || '',
            mode: 'insensitive',
          },
          isDeleted: false,
        },
        subscriptionStatus: subscriptionFilter,
        verificationStatus: verificationFilter,
      },
      include: { user: true },
    });

    return ApiResponse.success(getData, 'Sellers fetched successfully');
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
      return ApiResponse.error(
        'Total amount monthwise is not implemented yet',
        error,
      );
    }
  }
  // find all users and sellers
  async findAllUsersAndSellers() {
    try {
      const users = await this.prisma.user.findMany();
      const sellers = await this.prisma.seller.findMany({
        where: {
          user: { isDeleted: false },
          verificationStatus: 'VERIFIED',
          subscriptionStatus: true,
        },
      });
      const startOfMonth = new Date();
      startOfMonth.setDate(1);

      const newSellers = await this.prisma.seller.findMany({
        where: {
          createdAt: {
            gte: startOfMonth,
          },
        },
      });
      return ApiResponse.success(
        {
          users: users.length,
          sellers: sellers.length,
          newSellersOFthisMonth: newSellers.length,
        },
        'Users and Sellers fetched successfully',
      );
    } catch (error) {
      return ApiResponse.error('Error fetching users and sellers', error);
    }
  }

  // seller verification by admin
  async verifySeller(id: string, status: VerificationStatusDto) {
    try {
      // Verify seller by id

      const updatedSeller = await this.prisma.seller.update({
        where: { userId: id },
        data: { verificationStatus: status.status },
      });
      return ApiResponse.success(updatedSeller, 'Seller verified successfully');
    } catch (error) {
      return ApiResponse.error('Error verifying seller', error);
    }
  }
  // delete seller
  async deleteSeller(id: string) {
    try {
      await this.prisma.user.update({
        where: { id },
        data: { isDeleted: true },
      });
      return ApiResponse.success(null, 'Seller deleted successfully');
    } catch (error) {
      return ApiResponse.error('Error deleting seller', error);
    }
  }

  // block user
  async blockUser(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: { isBlocked: !user.isBlocked },
      });
      return ApiResponse.success(
        updatedUser,
        `User ${updatedUser.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      );
    } catch (error) {
      return ApiResponse.error('Error blocking/unblocking user', error);
    }
  }
  // update role
  async updateUserRole(id: string, role: UpdateRoleDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: { role: role.role, isOtpVerified: true },
      });
      return ApiResponse.success(
        updatedUser,
        `User role updated to ${role} successfully`,
      );
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
