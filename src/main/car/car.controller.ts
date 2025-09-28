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
import { CarService } from './car.service';
import { ProductService } from '../product/product.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/guards/roles.decorator';
import { UserRole } from 'src/utils/common/enum/userEnum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CreateCarDto } from './dto/create-car.dto';
import { Public } from 'src/guards/public.decorator';

@Controller('car')
export class CarController {
  constructor(
    private readonly carService: CarService,
    private readonly productService: ProductService,
  ) {}

  @UseGuards(AuthGuard)
  @Roles(UserRole.SELLER)
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateCarDto })
  async createCarProduct(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() createProductDto: CreateCarDto,
    @Req() req: { userid: string },
  ) {
    return await this.productService.handleProductCreation(
      createProductDto,
      images,
      req.userid,
    );
  }

  @Get()
  @Public()
  findAll() {
    return this.carService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.carService.findOne(id);
  }

  // update a car
  // @UseGuards(AuthGuard)
  // @Roles(UserRole.SELLER)
  // @Patch(':id')
  // @Public()
  // @UseInterceptors(FilesInterceptor('images'))
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({ type: CreateCarDto })
  // async updateCarProduct(
  //   @UploadedFiles() images: Express.Multer.File[],
  //   @Body() updateProductDto: UpdateCarDto,
  //   @Param('id') id: string,

  // ) {
  //   return await this.carService.carUpdate(
  //     id,
  //     updateProductDto,

  //   );
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carService.remove(id);
  }
}
