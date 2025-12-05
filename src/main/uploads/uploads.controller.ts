// upload.controller.ts

import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/guards/public.decorator';
import { ApiResponse } from 'src/utils/common/apiresponse/apiresponse';
import { storageConfig } from 'src/utils/file/fileUpload';
import { UploadMultipleDto } from './dto/upload.dto';

@ApiTags('Upload')
@Controller('upload')
@Public()
export class UploadController {
  @Post('multiple')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10, { storage: storageConfig() })) // max 10 files
  @ApiBody({
    description: 'Upload multiple images',
    type: UploadMultipleDto,
  })
  uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    const fileUrls = files.map((file) => {
      // In a real application, you would save the file and generate a URL
      return `${process.env.DOMAIN}/uploads/${file.filename}`;
    });
    return ApiResponse.success(fileUrls, 'Files uploaded successfully');
  }
}
