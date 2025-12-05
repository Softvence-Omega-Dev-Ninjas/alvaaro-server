import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { UpdateWatchDto } from './dto/update-watch.dto';
import { ApiResponse } from 'src/utils/common/apiresponse/apiresponse';

@Injectable()
export class WatchService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    try {
      const allWatch = await this.prisma.watch.findMany({
        include: { product: true },
      });
      return ApiResponse.success(allWatch, 'Watches fetched successfully');
    } catch (error) {
      return ApiResponse.error('Failed to fetch watches', error);
    }
  }

  async findOne(id: string) {
    try {
      const watch = await this.prisma.watch.findUnique({
        where: { id },
        include: { product: true },
      });

      return ApiResponse.success(watch, 'Watch fetched successfully');
    } catch (error) {
      return ApiResponse.error('Failed to fetch watch', error);
    }
  }

  async remove(id: string) {
    try {
      const existingWatch = await this.prisma.watch.findUnique({
        where: { id },
      });

      if (!existingWatch) {
        return ApiResponse.error(`Watch with ID ${id} not found`);
      }

      await this.prisma.watch.delete({ where: { id } });
      await this.prisma.product.delete({
        where: { id: existingWatch.productId },
      });

      return ApiResponse.success(
        null,
        'Watch and associated product deleted successfully',
      );
    } catch (error) {
      return ApiResponse.error('Failed to delete watch', error);
    }
  }
}
