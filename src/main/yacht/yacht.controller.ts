import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import { YachtService } from './yacht.service';
import { CreateYachtDto } from './dto/create-yacht.dto';
import { UpdateYachtDto } from './dto/update-yacht.dto';
import { ProductService } from '../product/product.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/guards/roles.decorator';
import { UserRole } from 'src/utils/common/enum/userEnum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('yacht')
export class YachtController {
  constructor(
    private readonly yachtService: YachtService,
    private readonly productService: ProductService,
  ) {}

  @UseGuards(AuthGuard)
  @Roles(UserRole.SELLER)
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
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
    return this.yachtService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateYachtDto: UpdateYachtDto) {
    return this.yachtService.update(+id, updateYachtDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.yachtService.remove(+id);
  }
}
