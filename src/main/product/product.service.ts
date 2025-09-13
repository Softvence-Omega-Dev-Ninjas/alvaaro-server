import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { uploadMultipleToCloudinary } from 'src/utils/common/cloudinary/cloudinary';
import { CreateProductDto } from './dto/create-product.dto';
import {
  isCarDto,
  isJewelleryDto,
  isRealEstateDto,
  isWatchDto,
  isYachtDto,
} from './matchers';
import { ApiResponse } from 'src/utils/common/apiresponse/apiresponse';
import { CategoryType } from '@prisma/client';
import { UpdateProductDto } from './dto/update-product.dto';
import { HelperService } from 'src/utils/helper/helper.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helperService: HelperService,
  ) {}

  async handleProductCreation(
    dto: CreateProductDto,
    images: Express.Multer.File[],
    userid: string,
  ) {
    try {
      const sellerId = await this.helperService.sellerExists(userid);
      const imageUrls = images?.length
        ? (await uploadMultipleToCloudinary(images)).map(
            (res: { secure_url: string }) => res.secure_url,
          )
        : [];

      const product = await this.prisma.product.create({
        data: {
          name: dto.name,
          description: dto.description,
          price: dto.price,
          images: imageUrls,
          category: dto.category,
          address: dto.address,
          city: dto.city,
          state: dto.state,
          zip: dto.zip,
          isExclusive: Boolean(dto.isExclusive),
          sellerId,
          views: 0,
        },
      });
      if (isRealEstateDto(dto)) {
        await this.prisma.realEstate.create({
          data: {
            productId: product.id,
            beds: dto.beds,
            size: dto.size,
            washroom: dto.washroom,
            features: Array.isArray(dto.features)
              ? dto.features
              : [dto.features],
          },
        });
      } else if (isCarDto(dto)) {
        await this.prisma.car.create({
          data: {
            productId: product.id,
            carBodyStyle: dto.carBodyStyle,
            model: dto.model,
            year: dto.year,
            mileage: dto.mileage,
            condition: dto.condition,
            transmission: dto.transmission,
            cylinders: dto.cylinders,
            tractionType: dto.tractionType,
            fuelType: dto.fuelType,
            manufacture: dto.manufacture,
          },
        });
      } else if (isYachtDto(dto)) {
        await this.prisma.yacht.create({
          data: {
            productId: product.id,
            beds: dto.beds,
            size: dto.size,
            washroom: dto.washroom,
            features: Array.isArray(dto.features)
              ? dto.features
              : [dto.features],
          },
        });
      } else if (isWatchDto(dto)) {
        await this.prisma.watch.create({
          data: {
            productId: product.id,
            displayType: dto.displayType,
            waterResistance: dto.waterResistance,
            warranty: dto.warranty,
            manufacture: dto.manufacture,
            condition: dto.condition,
            model: dto.model,
            movement: dto.movement,
            strapMaterial: dto.strapMaterial,
            tractionType: dto.tractionType,
            size: dto.size,
            features: Array.isArray(dto.features)
              ? dto.features
              : [dto.features],
          },
        });
      } else if (isJewelleryDto(dto)) {
        await this.prisma.jewellery.create({
          data: {
            productId: product.id,
            condition: dto.condition,
            size: dto.size,
            tractionType: dto.tractionType,
            features: Array.isArray(dto.features)
              ? dto.features
              : [dto.features],
            displayType: dto.displayType,
            manufacture: dto.manufacture,
            warranty: dto.warranty,
            model: dto.model,
            waterResistance: dto.waterResistance,
            strapMaterial: dto.strapMaterial,
            movement: dto.movement,
          },
        });
      }
      return ApiResponse.success(product, 'Product created successfully');
    } catch (error) {
      console.log('Error creating product:', error);
      return ApiResponse.error(
        'Failed to create product, please try again later',
        error,
      );
    }
  }

  async findAllProducts(
    category?: CategoryType,
    location?: string,
    minPrice?: number,
    maxPrice?: number,
  ) {
    const products = await this.prisma.product.findMany({
      where: {
        ...(category && { category }),
        ...(location && {
          OR: [
            { address: { contains: location, mode: 'insensitive' } },
            { city: { contains: location, mode: 'insensitive' } },
            { state: { contains: location, mode: 'insensitive' } },
            { zip: { contains: location, mode: 'insensitive' } },
          ],
        }),
        ...(minPrice !== undefined || maxPrice !== undefined
          ? {
              price: {
                ...(minPrice !== undefined && { gte: minPrice }),
                ...(maxPrice !== undefined && { lte: maxPrice }),
              },
            }
          : {}),
      },
      include: {
        seller: {
          select: {
            id: true,
            phone: true,
            address: true,
            companyName: true,
            companyWebsite: true,
          },
        },
        RealEstate: true,
        Car: true,
        Yacht: true,
        Watch: true,
        Jewellery: true,
        _count: { select: { Wishlist: true } },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return ApiResponse.success(products, 'Products fetched successfully');
  }

  async findProductById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            phone: true,
            address: true,
            companyName: true,
            companyWebsite: true,
          },
        },
        RealEstate: true,
        Car: true,
        Yacht: true,
        Watch: true,
        Jewellery: true,
        _count: { select: { Wishlist: true } },
      },
    });
    if (!product) {
      return ApiResponse.error('Product not found', null);
    }
    // Increment views count
    await this.prisma.product.update({
      where: { id },
      data: {
        views: { increment: 1 },
      },
    });
    return ApiResponse.success(product, 'Product fetched successfully');
  }

  async findAllPremiumProducts(category?: CategoryType, search?: string) {
    const premiumProducts = await this.prisma.product.findMany({
      where: {
        isExclusive: true,
        ...(category && { category }),
        ...(search && {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        }),
      },
      include: {
        seller: {
          select: {
            id: true,
            phone: true,
            address: true,
            companyName: true,
            companyWebsite: true,
          },
        },
        RealEstate: true,
        Car: true,
        Yacht: true,
        Watch: true,
        Jewellery: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return ApiResponse.success(
      premiumProducts,
      'Premium products fetched successfully',
    );
  }

  async searchRealEstate(query?: {
    location?: string;
    minPrice?: string;
    maxPrice?: string;
    type?: string;
  }) {
    const { minPrice, maxPrice, type } = query ?? {};

    const products = await this.prisma.product.findMany({
      where: {
        category: 'REAL_ESTATE',
        price: {
          gte: minPrice ? minPrice : undefined,
          lte: maxPrice ? maxPrice : undefined,
        },
        AND: [
          type
            ? {
                RealEstate: {
                  is: {
                    features: {
                      has: type,
                    },
                  },
                },
              }
            : {},
        ],
      },
      include: {
        RealEstate: true,
        seller: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return ApiResponse.success(
      products,
      'Real estate products fetched successfully',
    );
  }

  async findProductBySellerId(sellerId: string) {
    const products = await this.prisma.product.findMany({
      where: { sellerId },
      include: {
        seller: {
          select: {
            id: true,
            phone: true,
            address: true,
            companyName: true,
            companyWebsite: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return ApiResponse.success(products, 'Products fetched successfully');
  }

  async deleteProduct(id: string) {
    try {
      const product = await this.prisma.product.delete({
        where: { id },
      });
      return ApiResponse.success(product, 'Product deleted successfully');
    } catch (error) {
      return ApiResponse.error(
        'Failed to delete product, please try again later',
        error,
      );
    }
  }
  async updateProduct(
    productId: string,
    files: Express.Multer.File[],
    updateDto: UpdateProductDto,
  ) {
    try {
      const existingProduct = await this.prisma.product.findUnique({
        where: { id: productId },
      });

      if (!existingProduct) {
        return ApiResponse.error('Product not found');
      }

      // --- Build update object dynamically ---
      const productUpdateData: any = {
        name: updateDto.name ?? existingProduct.name,
        description: updateDto.description ?? existingProduct.description,
        state: updateDto.state ?? existingProduct.state,
        city: updateDto.city ?? existingProduct.city,
        zip: updateDto.zip ?? existingProduct.zip,
        address: updateDto.address ?? existingProduct.address,
        price: updateDto.price ?? existingProduct.price,
      };

      // --- Handle relational updates ---
      const relations = ['RealEstate', 'Car', 'Watch', 'Yacht', 'Jewellery'];
      for (const relation of relations) {
        if (updateDto[relation]) {
          productUpdateData[relation] = {
            update: updateDto[relation],
          };
        }
      }

      // --- Handle image uploads ---
      if (files?.length > 0) {
        const uploadedImages = await uploadMultipleToCloudinary(files);
        productUpdateData.images = uploadedImages.map(
          (res: { secure_url: string }) => res.secure_url,
        );
      } else {
        productUpdateData.images = existingProduct.images;
      }

      // --- Update product ---
      const updatedProduct = await this.prisma.product.update({
        where: { id: productId },
        data: productUpdateData,
        include: {
          // seller: true,
          RealEstate: true,
          Car: true,
          Watch: true,
          Yacht: true,
          Jewellery: true,
        },
      });

      return ApiResponse.success(
        updatedProduct,
        'Product updated successfully',
      );
    } catch (error) {
      console.error('Error updating product:', error);
      return ApiResponse.error(
        'Failed to update product, please try again later',
        error,
      );
    }
  }

  async toggleWishlist(productId: string, userId: string) {
    const existing = await this.prisma.wishlist.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existing) {
      await this.prisma.wishlist.delete({
        where: { userId_productId: { userId, productId } },
      });
      return ApiResponse.success(null, 'Removed from wishlist');
    }

    await this.prisma.wishlist.create({
      data: { userId, productId },
    });

    return ApiResponse.success(null, 'Added to wishlist');
  }

  async getTotalViews(sellerId: string) {
    const { data: products } = await this.findProductBySellerId(sellerId);
    const totalViews = products.reduce(
      (sum, product) => sum + product.views,
      0,
    );
    return ApiResponse.success(
      totalViews,
      'Total views retrieved successfully',
    );
  }
}
