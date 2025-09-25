import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { SignInDto } from './dto/signin.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Request } from 'express';
import { PasswordDto } from './dto/passwords.dto';
import { Public } from 'src/guards/public.decorator';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { VerifyOtpForgottenPasswordDto } from './dto/verifyOtpForgottenPassword.dto';
import { VerifyOtpAndCreateUserDto } from './dto/verifyOtpAndCreateUser.dto';
import { ResendOtpDto } from './dto/resendOtp.dto';
import { storageConfig } from 'src/utils/file/fileUpload';

@Controller('auth')
@UseGuards(AuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Public()
  @UseInterceptors(FilesInterceptor('images', 10, { storage: storageConfig() }))
  @ApiConsumes('multipart/form-data')
  async signup(
    @Body() createAuthDto: CreateUserDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log(files);
    const filess = files.map(
      (f) => `${process.env.DOMAIN}/uploads/${f.filename}`,
    );

    return await this.authService.signup(createAuthDto, filess[0]);
  }

  // otp verification endpoint
  @Post('verify-otp')
  @Public()
  async verifyOtp(@Body() dto: VerifyOtpAndCreateUserDto) {
    return await this.authService.otpVerifyEmail(dto.email, dto.otp);
  }
  @Post('signin')
  @Public()
  async signin(@Body() signinDto: SignInDto) {
    return await this.authService.signin(signinDto);
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  async changePassword(@Body() dto: PasswordDto, @Req() req: Request) {
    return await this.authService.changePassword(req['userid'] as string, dto);
  }
  @Post('request-password-reset')
  @Public()
  async requestPasswordReset(@Body() dto: ForgotPasswordDto) {
    return await this.authService.requestPasswordReset(dto.email);
  }
  @Post('reset-password')
  @Public()
  async resetPassword(@Body() dto: VerifyOtpForgottenPasswordDto) {
    return await this.authService.verifyOtp(
      dto.email,
      dto.otp,
      dto.newPassword,
    );
  }

  // request for otp resend
  @Post('resend-otp')
  @Public()
  async resendOtp(@Body() dto: ResendOtpDto) {
    return await this.authService.requestPasswordReset(dto.email);
  }
}
