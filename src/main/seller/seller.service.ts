import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { MailService } from 'src/utils/mail/mail.service';
import { OtpDto } from '../auth/dto/signin.dto';
import { ApiResponse } from 'src/utils/common/apiresponse/apiresponse';

import { VerificationStatusType } from '@prisma/client';
import { contactSellerTemplate } from 'src/utils/mail/templates/contact-seller.template';
import { ContactSellerDto } from './dto/contact-seller.dto';

@Injectable()
export class SellerService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private mail: MailService,
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
          ...(verificationStatus && { verificationStatus }), // ✅ no "in"
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

      const html = contactSellerTemplate({
        sellerName: product.seller.user.fullName,
        buyerName: name,
        buyerEmail: email,
        buyerPhone: phone,
        message,
        productTitle: product.name,
      });

      const mailTo = product.seller.user.email;
      const subject = `New inquiry for ${product.name}`;

      await this.mail.sendMail(mailTo, subject, html);

      return { message: 'Mail sent to the seller!' };
    } catch (error) {
      return ApiResponse.error('Failed to contact seller', error);
    }
  }
}
