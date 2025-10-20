import {
  Controller,
  Patch,
  Param,
  Body,
  Get,
  Query,
  Delete,
  NotFoundException,
  Post,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { CategoryType, UserRole } from '@prisma/client';
import { ProductSearchQueryDto } from './dto/real-estate-search.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Public } from 'src/guards/public.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/guards/roles.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @Public()
  @ApiQuery({ name: 'category', enum: CategoryType, required: false })
  @ApiQuery({ name: 'location', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  async findAllProducts(
    @Query('category') category?: CategoryType,
    @Query('location') location?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
  ) {
    return await this.productService.findAllProducts(
      category,
      location,
      minPrice,
      maxPrice,
    );
  }
  //  Comment
  @Get('/premium')
  @ApiQuery({ name: 'category', enum: CategoryType, required: false })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by product name',
  })
  async findAllPremiumProducts(
    @Query('category') category?: CategoryType,
    @Query('search') search?: string,
  ) {
    return await this.productService.findAllPremiumProducts(category, search);
  }

  @Get('/real-estate/search')
  @ApiQuery({ name: 'location', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'type', required: false })
  searchRealEstate(@Query() query?: ProductSearchQueryDto) {
    return this.productService.searchRealEstate(query);
  }

  @Get('trending')
  getTrendingProducts() {
    return this.productService.getTrendingProducts();
  }

  @Public()
  @Get('top-locations')
  async getTopCites() {
    const result = await this.productService.getTopCites();
    return result;
  }

  @Get(':id')
  findProductById(@Param('id') id: string) {
    return this.productService.findProductById(id);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }

  @Get('/seller/:sellerId')
  findProductBySellerId(@Param('sellerId') sellerId: string) {
    return this.productService.findProductBySellerId(sellerId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images'))
  @ApiConsumes('multipart/form-data')
  async updateProduct(
    @UploadedFiles() images: Express.Multer.File[],
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const updatedProduct = await this.productService.updateProduct(
      id,
      images,
      updateProductDto,
    );
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updatedProduct;
  }

  @UseGuards(AuthGuard)
  @Post('wishlist/:productId')
  toggleWishlist(
    @Param('productId') productId: string,
    @Req() req: { userid: string },
  ) {
    const result = this.productService.toggleWishlist(productId, req.userid);

    return result;
  }
}
