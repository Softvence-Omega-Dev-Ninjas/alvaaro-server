import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import * as path from 'path';
import * as fs from 'fs';
import { ApiResponse } from 'src/utils/common/apiresponse/apiresponse';
@Injectable()
export class TiktokService {
  private readonly logger = new Logger(TiktokService.name);
  constructor(private readonly httpService: HttpService) { }
  async publish(title: string, filename: string, accessToken: string) {
    try {
      const videoPath = path.join(process.cwd(), 'public', 'uploads', filename);
      const videoStat = fs.statSync(videoPath);
      const videoSize = videoStat.size;
      const videoBuffer = fs.readFileSync(videoPath);

      const payload = {
        post_info: {
          title: title,
          privacy_level: 'SELF_ONLY',
          brand_content_toggle: false,
          brand_organic_toggle: false,
        },
        source_info: {
          source: 'FILE_UPLOAD',
          video_size: videoSize,
          chunk_size: videoSize,
          total_chunk_count: 1,
        },
      };

      const initResponse$ = this.httpService.post(
        'https://open.tiktokapis.com/v2/post/publish/video/init/',
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const initResponse = (await lastValueFrom(initResponse$)) as {
        data?: { data?: { upload_url: string; publish_id: string } };
      };
      const data = initResponse.data?.data as
        | { upload_url: string; publish_id: string }
        | undefined;

      const headers = {
        'Content-Range': `bytes 0-${videoSize - 1}/${videoSize}`,
        'Content-Length': videoSize.toString(),
        'Content-Type': 'video/mp4',
      };

      // Axios.put with HttpService (upload video)
      const uploadResponse$ = this.httpService.put(
        data!.upload_url,
        videoBuffer,
        {
          headers,
        },
      );
      const uploadResponse = await lastValueFrom(uploadResponse$);
      this.logger.log('Video upload response:', uploadResponse.status);
      if (uploadResponse.status >= 200 && uploadResponse.status < 300) {
        try {
          await fs.promises.unlink(videoPath);
          this.logger.log(`Deleted uploaded file: ${filename}`);
        } catch (unlinkError) {
          this.logger.error(`Failed to delete file ${filename}:`, unlinkError);
        }
      }
      return ApiResponse.success('Video uploaded successfully');
    } catch (error: any) {
      this.logger.error('TikTok Upload Error:', error?.response?.data || error);
      return ApiResponse.error('Video upload failed');
    }
  }
}
