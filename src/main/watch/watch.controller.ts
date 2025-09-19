import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import { WatchService } from './watch.service';
import { CreateWatchDto } from './dto/create-watch.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductService } from '../product/product.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/guards/roles.decorator';
import { UserRole } from 'src/utils/common/enum/userEnum';
import { RolesGuard } from 'src/guards/role.guard';
import { storageConfig } from 'src/utils/file/fileUpload';

@ApiTags('Watch')
@Controller('watch')
export class WatchController {
  constructor(
    private readonly watchService: WatchService,
    private readonly productService: ProductService,
  ) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  @Post()
  @UseInterceptors(FilesInterceptor('images', 10, { storage: storageConfig() }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateWatchDto })
  async createWatchProduct(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() createProductDto: CreateWatchDto,
    @Req() req: { userid: string },
  ) {
    return await this.productService.handleProductCreation(
      createProductDto,
      images,
      req.userid,
    );
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  async findAll() {
    return await this.watchService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  async findOne(@Param('id') id: string) {
    return await this.watchService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  async remove(@Param('id') id: string) {
    return await this.watchService.remove(id);
  }
}
