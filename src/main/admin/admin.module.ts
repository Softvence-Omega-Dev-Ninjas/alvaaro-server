import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { JwtModule } from '@nestjs/jwt';
import { HelperModule } from 'src/utils/helper/helper.module';

@Module({
  imports: [JwtModule, HelperModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
