import { Injectable } from '@nestjs/common';
import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { ProductServiceMessageInterface } from 'src/common/utils/interfaces';
import { ProductsGrpcService } from 'src/common/services/products-grpc-client.service';
import { OrdersService } from 'src/orders/orders.service';
import { Product } from 'src/common/utils/interfaces';

@Injectable()
export class OrderService {
  constructor(
    private readonly configService: ConfigService,
    private readonly productsGrpcService: ProductsGrpcService,
    private readonly ordersService: OrdersService,
  ) {}

  async updateOrder(payload: ProductServiceMessageInterface) {
    try {
      const { product_id } = payload;
      const products: Product[] = await this.productsGrpcService.getProducts([
        product_id,
      ]);
      if (products.length !== 1 || products[0].id !== product_id)
        return { done: true };
      const { name, description, price } = products[0];
      await this.ordersService.updateProductInOrder(product_id, {
        name,
        description,
        price,
      });
      // update cache
      await this.ordersService.cacheMultipleProducts(products);
      return { done: true };
    } catch (error) {
      throw error;
    }
  }
}
