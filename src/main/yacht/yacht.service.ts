import { Injectable } from '@nestjs/common';
import { CreateYachtDto } from './dto/create-yacht.dto';
import { UpdateYachtDto } from './dto/update-yacht.dto';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { ApiResponse } from 'src/utils/common/apiresponse/apiresponse';

@Injectable()
export class YachtService {
  constructor(private readonly prismaService: PrismaService) { }

  async findAll() {
    const yachts = await this.prismaService.yacht.findMany({});
    return ApiResponse.success(yachts, 'Yachts retrieved successfully');
  }

  async findOne(id: string) {
    const yacht = await this.prismaService.yacht.findUnique({ where: { id } });
    if (!yacht) {
      return ApiResponse.error('Yacht not found');
    }
    return ApiResponse.success(yacht, 'Yacht retrieved successfully');
  }


}
