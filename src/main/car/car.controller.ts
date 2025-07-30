import { Controller, Get, Param, Delete } from '@nestjs/common';
import { CarService } from './car.service';

@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  // @Post()
  // @UseInterceptors(FilesInterceptor('images'))
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({ type: CreateCarDto })
  // async create(
  //   @Body() createCarDto: CreateCarDto,
  //   @UploadedFiles() files: Express.Multer.File[],
  // ) {
  //   let images: string[] = [];
  //   if (files && files.length > 0) {
  //     const uploadResults = await uploadMultipleToCloudinary(files);
  //     images = uploadResults.map((res: any) => res.secure_url);
  //   }

  //   return this.carService.create(createCarDto, images);
  // }

  @Get()
  findAll() {
    return this.carService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carService.remove(id);
  }
}
