import { Injectable } from '@nestjs/common';
import { contains } from 'class-validator';
import { PrismaService } from 'src/prisma-service/prisma-service.service';

type UserSearchPayload = {
  v_status?: 'PENDING' | 'VERIFIED' | 'REJECTED'; // optional if you want it flexible
  s_status?: string; // also optional
  fullName?: string;
  email?: string;
};

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

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
    } catch (error) {}
  }
}
