import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { AuthModule } from '../auth/auth.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [ProductModule, AuthModule],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
