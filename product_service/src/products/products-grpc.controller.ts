import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProductsService } from './products.service';

@Controller('productsgrpc')
export class ProductsGrpcController {
  constructor(private readonly productsService: ProductsService) {}

  @GrpcMethod('ProductService', 'getProducts')
  async getProducts(data: { productids: string }) {
    const { productids } = data;
    const products_response = await this.productsService.findMany({
      _id: { $in: productids },
    });
    const products = JSON.stringify(products_response);
    return { products };
  }
}
