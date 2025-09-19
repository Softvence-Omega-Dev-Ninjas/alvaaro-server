import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import { YachtService } from './yacht.service';
import { CreateYachtDto } from './dto/create-yacht.dto';
import { ProductService } from '../product/product.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/guards/roles.decorator';
import { UserRole } from 'src/utils/common/enum/userEnum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { storageConfig } from 'src/utils/file/fileUpload';

@Controller('yacht')
export class YachtController {
  constructor(
    private readonly yachtService: YachtService,
    private readonly productService: ProductService,
  ) {}

  @UseGuards(AuthGuard)
  @Roles(UserRole.SELLER)
  @Post()
  @UseInterceptors(FilesInterceptor('images', 10, { storage: storageConfig() }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateYachtDto })
  async createYachtProduct(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() createProductDto: CreateYachtDto,
    @Req() req: { userid: string },
  ) {
    return await this.productService.handleProductCreation(
      createProductDto,
      images,
      req.userid,
    );
  }

  @Get()
  findAll() {
    return this.yachtService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.yachtService.findOne(id);
  }
}
