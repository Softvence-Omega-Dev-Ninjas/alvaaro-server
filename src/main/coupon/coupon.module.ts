import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { HelperService } from 'src/utils/helper/helper.service';

@Module({
  controllers: [CouponController],
  providers: [CouponService, HelperService],
})
export class CouponModule {}
