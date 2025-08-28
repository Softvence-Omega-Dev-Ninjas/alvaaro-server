import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { ApiResponse } from 'src/utils/common/apiresponse/apiresponse';

@Injectable()
export class RealEstateService {
  constructor(private readonly prismaService: PrismaService) { }

  async findAll() {
    const realEstates = await this.prismaService.realEstate.findMany();
    return ApiResponse.success(realEstates, 'Real estates retrieved successfully');
  }

  findOne(id: string) {
    const realEstate = this.prismaService.realEstate.findUnique({ where: { id } });
    return ApiResponse.success(realEstate, 'Real estate retrieved successfully');
  }




}
