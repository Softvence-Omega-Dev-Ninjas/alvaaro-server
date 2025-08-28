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
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { CategoryType } from '@prisma/client';
import { RealEstateSearchQueryDto } from './dto/real-estate-search.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Get()
  @ApiQuery({ name: 'category', enum: CategoryType, required: false })
  async findAllProducts(@Query('category') category?: CategoryType) {
    return await this.productService.findAllProducts(category);
  }

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
  searchRealEstate(@Query() query?: RealEstateSearchQueryDto) {

    return this.productService.searchRealEstate(query);
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

  @Patch(':id')
  @ApiConsumes('application/json')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const updatedProduct = await this.productService.updateProduct(
      id,
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
