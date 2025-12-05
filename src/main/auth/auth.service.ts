import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ApiResponse } from 'src/utils/common/apiresponse/apiresponse';
import { HelperService } from 'src/utils/helper/helper.service';
import { MailService } from 'src/utils/mail/mail.service';
import { buildOtpEmail } from 'src/utils/mail/templates/html/otp.template';
import { PrismaService } from '../../prisma-service/prisma-service.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { PasswordDto } from './dto/passwords.dto';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly helper: HelperService,
    private readonly mailService: MailService,
  ) { }

  async signup(createUserDto: CreateUserDto, imageUrl: string) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: createUserDto.email, isDeleted: false },
      });
      if (existingUser) {
        throw new HttpException('User with this email already exists', 400);
      }
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        saltOrRounds,
      );

      // Ensure 'images' property is included, as Prisma expects a string
      const { images, ...rest } = createUserDto;

      // handle current time and set to local time
      const expiryTime = this.helper.getLocalDateTime(5); // 5 minutes from now
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-character OTP

      // sending otp to user email
      await this.mailService.sendMail(
        createUserDto.email,
        'Verify your email',
        buildOtpEmail({
          otp: otp,
        }),
      );

      let imagesString: string;
      if (Array.isArray(images)) {
        // Convert array of files to a JSON string or comma-separated string as needed
        imagesString = JSON.stringify(images);
      } else {
        imagesString = images ?? '';
      }
      console.log(imagesString);
      const data = {
        ...rest,
        password: hashedPassword,
        images: imageUrl,
        otp,
        otpExpiry: expiryTime,
      };

      const result = await this.prisma.user.upsert({
        where: { email: createUserDto.email },
        update: data,
        create: data,
      });
      return ApiResponse.success(
        result,
        'User Created Successfully Wait for OTP verification',
      );
    } catch (error) {
      console.log(error);
      return ApiResponse.error('User Creation Failed!!', error);
    }
  }

  // otp verification will be done during signin
  async otpVerifyEmail(email: string, otp: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.otp !== otp) {
      throw new NotFoundException('Verification token not found or expired');
    }
    const getCurrentTime = this.helper.getLocalDateTime(0);
    if (
      !user.otpExpiry ||
      new Date(user.otpExpiry as string | number | Date) <
      new Date(getCurrentTime)
    ) {
      throw new NotFoundException('Verification token not found or expired');
    }
    // OTP is valid
    await this.prisma.user.update({
      where: { email },
      data: {
        otp: null,
        otpExpiry: null,
        isOtpVerified: true,
      },
    });
    return ApiResponse.success(null, 'Email verified successfully');
  }
  async signin(signinDto: SignInDto) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email: signinDto.email },
      });

      if (!user) {
        return ApiResponse.error('User not found');
      }

      if (user.isDeleted) {
        return ApiResponse.error('This account has been deleted');
      }

      const isPasswordValid = await bcrypt.compare(
        signinDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        return ApiResponse.error('Invalid password');
      }

      const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      const token = await this.jwtService.signAsync(payload);

      return ApiResponse.success({ accessToken: token }, 'Login successful');
    } catch (error: unknown) {
      console.error('Error signing in:', error);
      const message =
        error instanceof HttpException
          ? error.message
          : 'Internal server error';

      return {
        success: false,
        error: message,
      };
    }
  }

  async changePassword(id: string, dto: PasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      return ApiResponse.error('User not found');
    }

    const isOldPasswordCorrect = await bcrypt.compare(
      dto.oldpassword,
      user.password,
    );

    if (!isOldPasswordCorrect) {
      return ApiResponse.error('Old password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(dto.newpassword, 10);

    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return ApiResponse.success(null, 'Password updated successfully');
  }

  // forgot password
  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      return ApiResponse.error('User not found');
    }

    // Generate secure token
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-character OTP
    const expiry = this.helper.getLocalDateTime(5); // 5 minutes from now
    console.log({ otp, expiry });
    // Store token and expiry in the database
    await this.prisma.user.update({
      where: { email },
      data: {
        otp,
        otpExpiry: expiry,
      },
    });

    // Send email with OTP
    await this.mailService.sendMail(
      email,
      'Otp Verification from Alvaaro',
      otp,
    );

    return ApiResponse.success(null, 'OTP sent to your email');
  }
  // verify OTP
  async verifyOtp(email: string, otp: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      return ApiResponse.error('User not found');
    }

    if (user.otp !== otp) {
      return ApiResponse.error('Invalid OTP');
    }
    const getCurrentTime = this.helper.getLocalDateTime(0);
    console.log({ getCurrentTime });
    if (
      !user.otpExpiry ||
      new Date(user.otpExpiry as string | number | Date) <
      new Date(getCurrentTime)
    ) {
      return ApiResponse.error('OTP has expired');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { email },
      data: {
        otp: null,
        otpExpiry: null,
        password: hashedPassword,
      },
    });
    return ApiResponse.success(null, 'Password reset successfully');
    // OTP is valid
  }
  // otp for change isotpverified to true
  async otpVerify(email: string, otp: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.otp !== otp) {
      throw new NotFoundException('Verification token not found or expired');
    }
    const getCurrentTime = this.helper.getLocalDateTime(0);
    if (
      !user.otpExpiry ||
      new Date(user.otpExpiry as string | number | Date) <
      new Date(getCurrentTime)
    ) {
      throw new NotFoundException('Verification token not found or expired');
    }
    // OTP is valid
    await this.prisma.user.update({
      where: { email },
      data: {
        otp: null,
        otpExpiry: null,
        isOtpVerified: true,
      },
    });
    return ApiResponse.success(null, 'Email verified successfully');
  }
}
