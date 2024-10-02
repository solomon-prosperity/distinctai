import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Query,
  Param,
  // Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  // ApiQuery,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product-dto';
import { GetProductsDto } from './dto/get-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Owner } from 'src/common/utils/interfaces';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { VerifyTokenGuard } from '../common/guards/verify-token.guard';

@ApiTags('Products')
@ApiBearerAuth('access-token')
@UseGuards(VerifyTokenGuard)
@Controller('/v1/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Create a product' })
  @ApiBody({ type: CreateProductDto })
  @Post()
  async create(
    @Body() payload: CreateProductDto,
    @CurrentUser() currentUser: Owner,
  ) {
    const response = await this.productsService.create(currentUser.id, payload);
    return {
      response: response,
      message: 'Product created successfully!',
    };
  }

  @ApiOperation({ summary: 'Get Products' })
  // @ApiQuery({ type: GetProductsDto })
  @Get()
  async getProducts(
    @CurrentUser() currentUser: Owner,
    @Query() payload: GetProductsDto,
  ) {
    const response = await this.productsService.getProducts(
      currentUser.id,
      payload,
    );
    return {
      response: response,
      message: 'Products retrieved successfully!',
    };
  }

  @ApiOperation({ summary: 'Get a Product' })
  @ApiParam({ name: 'product_id', description: 'ID of the product' })
  @Get(':product_id')
  async getProduct(
    @CurrentUser() currentUser: Owner,
    @Param('product_id') product_id: string,
  ) {
    const response = await this.productsService.getProduct(
      product_id,
      currentUser.id,
    );
    return {
      response: response,
      message: 'Product retrieved successfully!',
    };
  }

  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'product_id', description: 'ID of the product' })
  @ApiBody({ type: UpdateProductDto })
  @Put(':product_id')
  async updateProfile(
    @CurrentUser() currentUser: Owner,
    @Param('product_id') product_id: string,
    @Body() payload: UpdateProductDto,
  ) {
    const response = await this.productsService.updateProduct(
      product_id,
      currentUser.id,
      payload,
    );
    return {
      response: response,
      message: 'Product updated successfully!',
    };
  }
}
