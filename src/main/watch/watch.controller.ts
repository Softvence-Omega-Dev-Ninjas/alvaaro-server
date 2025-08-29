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
import { WatchService } from './watch.service';
import { CreateWatchDto } from './dto/create-watch.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UpdateWatchDto } from './dto/update-watch.dto';
import { ProductService } from '../product/product.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/guards/roles.decorator';
import { UserRole } from 'src/utils/common/enum/userEnum';
import { RolesGuard } from 'src/guards/role.guard';

@ApiTags('Watch')
@Controller('watch')
export class WatchController {
  constructor(
    private readonly watchService: WatchService,
    private readonly productService: ProductService,
  ) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
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
  findAll() {
    return this.watchService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  findOne(@Param('id') id: string) {
    return this.watchService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images'))
  @ApiBody({ type: UpdateWatchDto })
  update(@Param('id') id: string, @Body() updateWatchDto: UpdateWatchDto) {
    return this.watchService.update(id, updateWatchDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  remove(@Param('id') id: string) {
    return this.watchService.remove(id);
  }
}
