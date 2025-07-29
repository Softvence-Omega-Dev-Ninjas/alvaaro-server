import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponService.createCoupon(createCouponDto);
  }

  @Get()
  findAll() {
    return this.couponService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.couponService.removeCoupon(id);
  }
}
