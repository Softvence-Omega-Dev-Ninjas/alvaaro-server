import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { HelperModule } from 'src/utils/helper/helper.module';

@Module({
  imports: [JwtModule, HelperModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
