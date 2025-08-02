import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { SellerService } from './seller.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Request } from 'express';
import { OtpDto } from '../auth/dto/signin.dto';
import { Roles } from 'src/guards/roles.decorator';
import { RolesGuard } from 'src/guards/role.guard';
import { UserRole } from 'src/utils/common/enum/userEnum';
import { ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { ContactSellerDto } from './dto/contact-seller.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { uploadMultipleToCloudinary } from 'src/utils/common/cloudinary/cloudinary';

@UseGuards(AuthGuard)
@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Post('create-seller')
  // @UseInterceptors(FilesInterceptor('documents'))
  // @ApiConsumes('multipart/form-data')
  async sendOtpAndCacheInfo(
    @Body() createSellerDto: CreateSellerDto,
    @Req() req: Request,
    // @UploadedFiles() documents: Express.Multer.File[],
  ) {
    // const cloudinaryUrls =
    //   documents?.length > 0
    //     ? (await uploadMultipleToCloudinary(documents)).map(
    //         (res: { secure_url: string }) => res.secure_url,
    //       )
    //     : [];
    // console.log('cloudinaryUrls from seller controller', cloudinaryUrls);
    return this.sellerService.sendOtpAndCacheInfo(
      createSellerDto,
      req['email'] as string,
    );
  }
  @Post('otp')
  verifyOtpAndCreate(@Body() otp: OtpDto, @Req() req: Request) {
    return this.sellerService.verifyOtpAndCreate(
      otp,
      req['userid'] as string,
      req['email'] as string,
    );
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
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
    // console.log(verificationStatus, subscriptionStatus, search);
    // const {verificationStatus, subscriptionStatus, search} =
    return await this.sellerService.findAll({
      verificationStatus,
      subscriptionStatus,
      search,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sellerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSellerDto: UpdateSellerDto) {
    return this.sellerService.update(+id, updateSellerDto);
  }

  @Patch('verified-seller/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async verifiedSeller(@Param('id') id: string) {
    return await this.sellerService.verifiedSeller(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sellerService.remove(+id);
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
}
