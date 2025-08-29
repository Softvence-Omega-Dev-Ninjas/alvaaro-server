import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { ApiResponse } from 'src/utils/common/apiresponse/apiresponse';

@Injectable()
export class YachtService {
  constructor(private readonly prismaService: PrismaService) { }

  async findAll() {
    try {
      const yachts = await this.prismaService.yacht.findMany({
        include: { product: true }
      });
      return ApiResponse.success(yachts, 'Yachts retrieved successfully');
    } catch (error) {
      return ApiResponse.error('Failed to retrieve yachts', error);
    }
  }

  async findOne(id: string) {
    try {
      const yacht = await this.prismaService.yacht.findUnique({
        where: { id },
        include: { product: true }
      });

      if (!yacht) {
        return ApiResponse.error('Yacht not found');
      }
      return ApiResponse.success(yacht, 'Yacht retrieved successfully');
    } catch (error) {
      return ApiResponse.error('Failed to retrieve yacht', error);
    }
  }


}
