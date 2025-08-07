import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import * as qs from 'querystring';
import { HttpService } from '@nestjs/axios';
import { TikTokOAuthTokenResponse } from '../../../../utils/type/TikTokOAuthTokenResponse';
@Injectable()
export class TiktokAuthService {
  private readonly logger = new Logger(TiktokAuthService.name);

  private readonly clientKey = process.env.TIKTOK_CLIENT_KEY!;
  private readonly clientSecret = process.env.TIKTOK_CLIENT_SECRET!;
  private readonly redirectUri =
    'https://cobra-humorous-sharply.ngrok-free.app/tiktok-auth/callback';

  constructor(private readonly httpService: HttpService) {}

  async getAccessToken(
    code: string,
  ): Promise<TikTokOAuthTokenResponse | undefined> {
    const url = 'https://open.tiktokapis.com/v2/oauth/token/';
    const body = qs.stringify({
      client_key: this.clientKey,
      client_secret: this.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: this.redirectUri,
    });
    try {
      const response = this.httpService.post(url, body, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const responses = await lastValueFrom(response);
      return responses.data as TikTokOAuthTokenResponse;
    } catch (error) {
      this.logger.error('getAccessToken error', error);
    }
  }
}
