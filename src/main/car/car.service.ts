import { Injectable } from '@nestjs/common';
// import { CreateCarDto } from './dto/create-car.dto';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { ApiResponse } from 'src/utils/common/apiresponse/apiresponse';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarService {
  constructor(private prisma: PrismaService) { }


  async findAll() {
    try {
      const cars = await this.prisma.car.findMany({});
      const productIds = cars.map((car) => car.productId);

      const products = await this.prisma.product.findMany({
        where: { id: { in: productIds } },
        orderBy: { trending: 'desc' },
      });
      const carsWithProducts = cars.map((car) => {
        const product = products.find((p) => p.id === car.productId);
        return { ...product, ...car };
      });

      return ApiResponse.success(
        carsWithProducts,
        'Cars with product info retrieved successfully.',
      );
    } catch (error) {
      console.error('Error retrieving cars:', error);
      return ApiResponse.error('Failed to retrieve cars.', error);
    }
  }
  async findOne(id: string) {
    try {
      console.log('id', id);
      const carDetails = await this.prisma.car.findUnique({
        where: { id },
        include: {
          product: true,
        },
      });

      return ApiResponse.success(
        carDetails,
        'Car details retrieved successfully.',
      );
    } catch (error) {
      console.error('Error finding car:', error);
      return ApiResponse.error('Failed to find car.', error);
    }
  }
  // update a car
  async carUpdate(id: string, updateCarDto: UpdateCarDto) {
    try {
      const carDetails = await this.prisma.car.findUnique({
        where: { id }
      });

    } catch (error) {
      console.error('Error updating car:', error);
      return ApiResponse.error('Failed to update car.', error);
    }
  }

  async remove(id: string) {
    try {
      const carDetails = await this.prisma.car.findUnique({ where: { id } });
      const productId = carDetails?.productId;
      await this.prisma.car.delete({ where: { id } });
      if (productId) {
        const deleteProduct = await this.prisma.product.delete({
          where: { id: productId },
        });
        return ApiResponse.success(deleteProduct, 'Car  deleted successfully.');
      }
    } catch (error) {
      console.error('Error deleting car:', error);
      return ApiResponse.error('Failed to delete car.', error);
    }
  }


}
