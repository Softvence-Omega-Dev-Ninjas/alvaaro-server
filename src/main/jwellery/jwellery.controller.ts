import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Req,
  Post,
  Body,
} from '@nestjs/common';
import { JewelleryService } from './jwellery.service';
import { ProductService } from '../product/product.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/guards/roles.decorator';
import { UserRole } from 'src/utils/common/enum/userEnum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CreateJewelleryDto } from './dto/create-jwellery.dto';

@Controller('jewellery')
export class JwelleryController {
  constructor(
    private readonly jwelleryService: JewelleryService,
    private readonly productService: ProductService,
  ) {}

  @UseGuards(AuthGuard)
  @Roles(UserRole.SELLER)
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateJewelleryDto })
  async createJewelleryProduct(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() createProductDto: CreateJewelleryDto,
    @Req() req: { userid: string },
  ) {
    return this.productService.handleProductCreation(
      createProductDto,
      images,
      req.userid, // Use the user ID from the request
    );
  }

  @Get()
  findAll() {
    return this.jwelleryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jwelleryService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jwelleryService.remove(id);
  }
}
