import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { MailService } from 'src/utils/mail/mail.service';
import { OtpDto } from '../auth/dto/signin.dto';
import { ApiResponse } from 'src/utils/common/apiresponse/apiresponse';
import { VerificationStatusType } from '@prisma/client';
import { contactSellerTemplate } from 'src/utils/mail/templates/contact-seller.template';
import { ContactSellerDto } from './dto/contact-seller.dto';
import { HelperService } from 'src/utils/helper/helper.service';
import { ProductService } from '../product/product.service';

@Injectable()
export class SellerService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private mail: MailService,
    private readonly helper: HelperService,
    private productService: ProductService,
  ) {}

  async sendOtpAndCacheInfo(
    createSellerDto: CreateSellerDto,
    userEmail: string,
  ) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Generated OTP: ${otp} for email: ${userEmail}`);
    const cacheKey = `otp-${userEmail}`;
    const sellerInfoKey = `seller-info-${userEmail}`;

    // Save to cache
    await this.cacheManager.set(cacheKey, otp);
    await this.cacheManager.set(sellerInfoKey, createSellerDto);
    await this.mail.sendMail(
      userEmail,
      'OTP',
      `Your otp is ${otp}. This otp valid for 5 minutes`,
    );
    return { message: 'OTP sent successfully. Please check your email.' };
  }

  async verifyOtpAndCreate(otp: OtpDto, userId: string, userEmail: string) {
    // seller info check in database
    const sellerInfo = await this.prisma.seller.findUnique({
      where: { userId },
    });
    if (sellerInfo) {
      return ApiResponse.error('You are already a seller');
    }

    const cacheOtp = await this.cacheManager.get(`otp-${userEmail}`);
    const userInfo = await this.cacheManager.get<CreateSellerDto>(
      `seller-info-${userEmail}`,
    );

    if (!cacheOtp || !userInfo) {
      return ApiResponse.error('Otp has been expired');
    }

    const subscriptionPlanDetails =
      await this.prisma.subscriptionPlan.findUnique({
        where: { id: userInfo.subscriptionPlan },
      });
    if (!subscriptionPlanDetails) {
      return ApiResponse.error('Your Choosing subscription has been deleted');
    }
    if (cacheOtp !== otp.otp) {
      return ApiResponse.error('Invalid OTP');
    }

    // TODO: Payment processing logic here

    const result = await this.prisma.seller.create({
      data: {
        userId,
        companyName: userInfo.companyName,
        companyWebsite: userInfo.companyWebsite,
        phone: userInfo.phone,
        address: userInfo.address,
        state: userInfo.state,
        city: userInfo.city,
        zip: userInfo.zip,
      },
    });
    await this.prisma.user.update({
      where: { id: userId },
      data: { role: 'SELLER' },
    });

    await this.cacheManager.del(`otp-${userEmail}`);
    await this.cacheManager.del(`seller-info-${userEmail}`);
    return ApiResponse.success(result, 'Seller created successfully');
  }

  async findAll(filters: {
    verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
    subscriptionStatus?: 'ACTIVE' | 'INACTIVE';
    search?: string;
  }) {
    try {
      const { verificationStatus, subscriptionStatus, search } = filters;

      const result = await this.prisma.seller.findMany({
        where: {
          ...(verificationStatus && { verificationStatus }),
          ...(subscriptionStatus && {
            subscriptionStatus: subscriptionStatus === 'ACTIVE',
          }),
          ...(search && {
            OR: [
              { user: { fullName: { contains: search, mode: 'insensitive' } } },
              { user: { email: { contains: search, mode: 'insensitive' } } },
            ],
          }),
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return ApiResponse.success(result, 'Sellers retrieved successfully!');
    } catch (error) {
      console.error(error);
      return ApiResponse.error('Failed to retrieve sellers', error);
    }
  }

  // Seller verified by admin
  async verifiedSeller(userId: string) {
    const seller = await this.prisma.seller.findUnique({
      where: { userId },
    });
    if (!seller) {
      return ApiResponse.error('Seller does not exist');
    }

    if (seller.subscriptionStatus) {
      const result = await this.prisma.seller.update({
        where: { userId: userId },
        data: {
          verificationStatus: VerificationStatusType.VERIFIED,
        },
      });
      console.log(result, 'result');

      return ApiResponse.success(result, 'Seller verified successfully');
    }
  }

  async contactSeller(productId: string, contactSellerDto: ContactSellerDto) {
    const { email, name, phone, message } = contactSellerDto;

    try {
      const product = await this.prisma.product.findFirst({
        where: { id: productId },
        include: {
          seller: {
            include: {
              user: {
                select: {
                  email: true,
                  fullName: true,
                },
              },
            },
          },
        },
      });

      if (!product) {
        throw new NotFoundException('Product not found!');
      }

      const htmlContent = contactSellerTemplate({
        sellerName: product.seller.user.fullName,
        buyerName: name,
        buyerEmail: email,
        buyerPhone: phone,
        message,
        productTitle: product.name,
      });

      await this.mail.sendMail(
        product.seller.user.email,
        `New inquiry for ${product.name}`,
        htmlContent,
      );

      const result = await this.prisma.inquiry.create({
        data: {
          buyerName: name,
          buyerEmail: email,
          buyerPhone: phone,
          message,
          productId,
          sellerId: product.sellerId,
        },
      });

      return ApiResponse.success(
        result,
        'Inquiry sent successfully to the seller!',
      );
    } catch (error) {
      console.error('contactSeller error:', error);

      if (error instanceof NotFoundException) {
        return ApiResponse.error('Product not found');
      }

      return ApiResponse.error(
        'Failed to contact seller',
        error instanceof Error ? error.message : 'Unknown error occurred',
      );
    }
  }

  async getInquiryBySellerId(userId: string) {
    try {
      const sellerId = await this.helper.sellerExists(userId);

      const result = await this.prisma.inquiry.findMany({
        where: {
          sellerId,
        },
      });

      return ApiResponse.success(result, 'Inquiry retrieved successfully!');
    } catch (error) {
      console.log(error);
      return ApiResponse.error('Failed to retrieve inquiry!');
    }
  }

  //? Seller dashboard stats
  async getDashboardStatistics(userId: string) {
    const sellerId = await this.helper.sellerExists(userId);

    try {
      const [totalViews, totalListings, totalEngagement, totalSaves] =
        await Promise.all([
          this.productService.getTotalViews(sellerId),
          this.prisma.product.count({
            where: {
              sellerId,
            },
          }),
          this.prisma.inquiry.count({
            where: { sellerId },
          }),
          this.prisma.wishlist.count({
            where: { product: { sellerId } },
          }),
        ]);

      const result = {
        totalViews,
        totalListings,
        engagementRate: `${((totalEngagement / totalListings) * 100).toFixed(1)}%`,
        totalSaves,
      };

      return ApiResponse.success(
        result,
        'Seller stats retrieved successfully!',
      );
    } catch (error) {
      return ApiResponse.error('Something went wrong', error);
    }
  }

  async getDashboardAnalysis(userId: string) {
    const sellerId = await this.helper.sellerExists(userId);

    const products = await this.productService.findProductBySellerId(sellerId);
    const views = products.data.map((product) => {
      return {
        views: product.views,
        createdAt: product.createdAt,
      };
    });
    const inquiries = await this.prisma.inquiry.findMany({
      where: { sellerId },
    });
    const saves = await this.prisma.wishlist.findMany({
      where: { product: { sellerId } },
      include: { product: true },
    });

    const groupByMonth = <T extends { createdAt: Date }>(items: T[]) => {
      return items.reduce(
        (acc, item) => {
          const month = item.createdAt.toISOString().slice(0, 7);

          acc[month] = (acc[month] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );
    };

    const productCounts = groupByMonth(products.data);
    const inquiryCounts = groupByMonth(inquiries);
    const saveCounts = groupByMonth(saves);
    const viewsCounts = groupByMonth(views);

    const allMonths = new Set([
      ...Object.keys(productCounts),
      ...Object.keys(inquiryCounts),
      ...Object.keys(saveCounts),
      ...Object.keys(viewsCounts),
    ]);

    // merge into final array
    const result = Array.from(allMonths).map((month) => ({
      month,
      products: productCounts[month] || 0,
      inquiries: inquiryCounts[month] || 0,
      saves: saveCounts[month] || 0,
      views: viewsCounts[month] || 0,
    }));

    return ApiResponse.success(
      result,
      'Seller dashboard analytics retrieved successfully!',
    );
  }
}
