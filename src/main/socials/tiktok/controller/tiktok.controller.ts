import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { TiktokService } from '../services/tiktok.service';
import { UploadTiktokVideoDto } from '../dto/create-tiktok.dto';
@Controller('tiktok')
export class TiktokController {
  constructor(private readonly tiktokService: TiktokService) { }

  @Post('publish')
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: './public/uploads',
      }),
    }),
  )
  @ApiOperation({ summary: 'Upload video to TikTok' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadTiktokVideoDto })
  async publishVideo(
    @UploadedFile() video: Express.Multer.File,
    @Body() body: UploadTiktokVideoDto,
  ) {
    if (!video || !video.filename) {
      throw new BadRequestException('No video file uploaded.');
    }

    return await this.tiktokService.publish(
      body.title,
      video.filename,
      body.accessToken,
    );
  }
}
