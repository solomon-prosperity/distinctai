import { Injectable } from '@nestjs/common';
import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { ProductsService } from 'src/products/products.service';
import { OwnersGrpcService } from 'src/common/services/owners-grpc-client.service';
import { OwnerServiceMessageInterface } from 'src/rabbitmq/interfaces/rabbitmq.interface';

@Injectable()
export class ProductService {
  constructor(
    private readonly configService: ConfigService,
    private readonly productsService: ProductsService,
    private readonly ownersGrpcService: OwnersGrpcService,
  ) {}

  async updateProduct(payload: OwnerServiceMessageInterface) {
    try {
      const { owner_id } = payload;
      const owner = await this.ownersGrpcService.getOwner(owner_id);
      if (!owner) return { done: true };
      const { first_name, last_name, address, email } = owner;
      const update_payload = {
        owner_details: { first_name, last_name, address, email },
      };
      await this.productsService.updateProducts(owner_id, update_payload);
      return { done: true };
    } catch (error) {
      throw error;
    }
  }
}
