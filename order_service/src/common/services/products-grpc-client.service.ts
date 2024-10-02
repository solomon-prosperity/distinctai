import { OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { IProductsServiceGrpcMethods } from 'src/common/utils/interfaces';

export class ProductsGrpcService implements OnModuleInit {
  private productGrpcService: IProductsServiceGrpcMethods;
  constructor(@Inject('PRODUCTPROTO_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.productGrpcService =
      this.client.getService<IProductsServiceGrpcMethods>('ProductService');
  }

  async getProducts(productids: string[]) {
    const products_response = await this.productGrpcService
      .getProducts({
        productids,
      })
      .toPromise();
    const products = JSON.parse(products_response.products);
    // console.log({ products, products_response });
    if (products.docs && products.docs.length !== 0) return products.docs;
    return [];
  }
}
