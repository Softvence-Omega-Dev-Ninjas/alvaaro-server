import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { TiktokAuthService } from '../services/tiktok-auth.service';

@Controller('tiktok-auth')
export class TiktokAuthController {
  constructor(private readonly tiktokAuthService: TiktokAuthService) {}
  // Define your methods for handling TikTok authentication here
  @Get('callback')
  async handleCallback(@Query('code') code: string, @Res() res: Response) {
    try {
      const tokenResponse = (await this.tiktokAuthService.getAccessToken(
        code,
      )) as {
        access_token: string;
        refresh_token: string;
        [key: string]: any;
      };
      //   console.log({ tokenResponse });
      const redirectUrl = `http://localhost:4000/?accessToken=${tokenResponse.access_token}&refreshToken=${tokenResponse.refresh_token}`;
      return res.redirect(redirectUrl);
      //   console.log(`Redirecting to: ${redirectUrl}`);
      //   res.send({
      //     accessToken: tokenResponse.access_token,
      //     refreshToken: tokenResponse.refresh_token,
      //   });
    } catch (err) {
      console.error(err);
    }
  }
}
