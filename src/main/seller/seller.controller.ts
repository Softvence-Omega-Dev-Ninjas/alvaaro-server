import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/guards/roles.decorator';
import { TimeValidation } from 'src/guards/timeValidation.guard';
import { UserRole } from 'src/utils/common/enum/userEnum';
import { ContactSellerDto } from './dto/contact-seller.dto';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { SellerService } from './seller.service';

@Controller('seller')
// @UseGuards(AuthGuard, RolesGuard)
export class SellerController {
  constructor(private readonly sellerService: SellerService) { }



  // @Public()
  @Post('create-seller')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @ApiBody({ type: CreateSellerDto })
  async verifyOtpAndCreate(
    @Body() createSellerDto: CreateSellerDto,
    @Req() req: Request,
  ) {

    return await this.sellerService.createSeller(
      createSellerDto,
      req['userid'] as string,
      req['email'] as string,
    );
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard, TimeValidation)
  @Roles(UserRole.ADMIN)
  @ApiQuery({
    name: 'verificationStatus',
    required: false,
    enum: ['PENDING', 'VERIFIED', 'REJECTED'],
  })
  @ApiQuery({
    name: 'subscriptionStatus',
    required: false,
    enum: ['ACTIVE', 'INACTIVE'],
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by owner name or email',
  })
  async findAll(
    @Query('verificationStatus')
    verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED',
    @Query('subscriptionStatus') subscriptionStatus?: 'ACTIVE' | 'INACTIVE',
    @Query('search') search?: string,
  ) {
    return await this.sellerService.findAll({
      verificationStatus,
      subscriptionStatus,
      search,
    });
  }

  // @Patch('profile/update')
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(UserRole.SELLER)
  // async updateSellerProfile(
  //   @Body() updateSellerDto: CreateSellerDto,
  //   @Req() req: Request,
  // ) {
  //   return await this.sellerService.updateSellerProfile(
  //     updateSellerDto,
  //     req['userid'] as string,
  //   );
  // }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  @Get('inquiry')
  getInquiryBySellerId(@Req() req: { userid: string }) {
    return this.sellerService.getInquiryBySellerId(req.userid);
  }

  @Patch('verified-seller/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async verifiedSeller(@Param('id') id: string) {
    return await this.sellerService.verifiedSeller(id);
  }

  @UseGuards(AuthGuard)
  @Post('contact/:productId')
  @ApiBody({ type: ContactSellerDto })
  contactSeller(
    @Param('productId') productId: string,
    @Body() contactSellerDto: ContactSellerDto,
  ) {
    return this.sellerService.contactSeller(productId, contactSellerDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  @Get('dashboard/stats')
  getDashboardStatistics(@Req() req: { userid: string }) {
    return this.sellerService.getDashboardStatistics(req.userid);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  @Get('dashboard/analysis')
  getDashboardAnalysis(@Req() req: { userid: string }) {
    return this.sellerService.getDashboardAnalysis(req.userid);
  }
  // seller update
  @Patch('update-seller')
  @ApiBody({ type: UpdateSellerDto })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  async updateSeller(
    @Body() updateData: UpdateSellerDto,
    @Req() @Req() req: { userid: string },
  ) {
    return await this.sellerService.updateSeller(req.userid, updateData);
  }
}
