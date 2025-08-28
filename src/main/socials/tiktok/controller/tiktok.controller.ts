import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { TiktokService } from '../services/tiktok.service';
import { UploadTiktokVideoDto } from '../dto/create-tiktok.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('tiktok')
export class TiktokController {
  constructor(private readonly tiktokService: TiktokService) {}

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
    @Req() req: Request,
  ) {
    if (!video || !video.filename) {
      throw new BadRequestException('No video file uploaded.');
    }

    return await this.tiktokService.publish(
      body.title,
      video.filename,
      req['userid'],
    );
  }
}
