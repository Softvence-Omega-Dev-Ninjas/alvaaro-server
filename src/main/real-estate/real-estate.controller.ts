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
import { RealEstateService } from './real-estate.service';
import { CreateRealEstateDto } from './dto/create-real-estate.dto';
import { ProductService } from '../product/product.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/guards/roles.decorator';
import { UserRole } from 'src/utils/common/enum/userEnum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { storageConfig } from 'src/utils/file/fileUpload';

@Controller('real-estate')
export class RealEstateController {
  constructor(
    private readonly realEstateService: RealEstateService,
    private readonly productService: ProductService,
  ) {}

  @UseGuards(AuthGuard)
  @Roles(UserRole.SELLER)
  @Post()
  @UseInterceptors(FilesInterceptor('images', 10, { storage: storageConfig() }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateRealEstateDto })
  async createRealEstateProduct(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() createProductDto: CreateRealEstateDto,
    @Req() req: { userid: string },
  ) {
    // console.log(images, 'images');
    return await this.productService.handleProductCreation(
      createProductDto,
      images,
      req.userid,
    );
  }

  @Get()
  findAll() {
    return this.realEstateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.realEstateService.findOne(id);
  }
}
