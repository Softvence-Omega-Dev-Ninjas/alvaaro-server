import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { TiktokAuthService } from '../services/tiktok-auth.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('tiktok-auth')
export class TiktokAuthController {
  constructor(private readonly tiktokAuthService: TiktokAuthService) { }
  // Define your methods for handling TikTok authentication here

  @UseGuards(AuthGuard)
  @Get('callback')
  async handleCallback(
    @Query('code') code: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      const tokenResponse = (await this.tiktokAuthService.getAccessToken(
        code,
        req['userid'],
      )) as {
        access_token: string;
        refresh_token: string;
        [key: string]: any;
      };
      return res.redirect(
        `http://localhost:4000/?accessToken=${tokenResponse.access_token}&refreshToken=${tokenResponse.refresh_token}`,
      );
    } catch (err) {
      console.error(err);
    }
  }
}
