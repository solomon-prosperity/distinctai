import {
  Injectable,
  Inject,
  NotFoundException,
  // ForbiddenException,
} from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderDto } from './dto/create-order-dto';
import { GetOrdersDto } from './dto/get-orders.dto';
import {
  UpdateOrderInterface,
  GetOrdersInterface,
  Order,
} from './interfaces/order.interface';
import runInTransaction from 'src/common/utils/runInTransaction';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import {
  PaginateModel,
  PaginateResult,
  ClientSession,
  FilterQuery,
} from 'mongoose';
import * as moment from 'moment';
import { ProductsGrpcService } from 'src/common/services/products-grpc-client.service';
import { Product, UpdateProductInterface } from 'src/common/utils/interfaces';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('ORDER_MODEL')
    private readonly orderModel: PaginateModel<Order>,
    private readonly rabitmqService: RabbitmqService,
    private readonly productsGrpcService: ProductsGrpcService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(owner_id: string, payload: CreateOrderDto): Promise<Order> {
    try {
      const response = await runInTransaction(async (session) => {
        const { product_ids, ...rest } = payload;
        let products: Product[];
        // get products from cache, if cache miss, get from product service
        const cached_products = await this.getCachedProducts(product_ids);
        if (cached_products.length > 0) {
          products = cached_products as Product[];
        } else {
          products = await this.productsGrpcService.getProducts(product_ids);
        }
        if (products.length !== product_ids.length)
          throw new NotFoundException('Some product IDs are invalid');
        const products_to_save = products.map((product) => {
          const { name, description, price, id } = product;
          return { name, description, price, product_id: id };
        });
        const order = await new this.orderModel({
          owner_id,
          products: products_to_save,
          ...rest,
        }).save({ session });
        // cache product details
        await this.cacheMultipleProducts(products);
        return order;
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async findMany(
    payload: GetOrdersInterface,
    query: FilterQuery<Order>,
  ): Promise<PaginateResult<Order>> {
    try {
      const { page = 1, limit = 20 } = payload;
      const orders = await this.orderModel.paginate(query, {
        page,
        limit,
        sort: { createdAt: -1 },
      });
      return orders;
    } catch (error) {
      throw error;
    }
  }

  async findOne(
    query: FilterQuery<Order>,
    select?: string,
  ): Promise<Order | null> {
    try {
      const fields = select || [];
      const order = await this.orderModel.findOne(query).select(fields);
      return order;
    } catch (error) {
      throw error;
    }
  }

  async update(
    order_id: string,
    owner_id: string,
    payload: UpdateOrderInterface,
    session?: ClientSession,
    select?: string,
  ): Promise<Order | null> {
    try {
      const fields = select || [];
      const order = await this.orderModel
        .findOneAndUpdate(
          { _id: order_id, owner_id },
          {
            ...payload,
          },
          { new: true, session: session || null },
        )
        .select(fields);
      return order;
    } catch (error) {
      throw error;
    }
  }

  async getOrder(order_id: string, owner_id: string): Promise<Order | null> {
    try {
      const order = await this.findOne({ _id: order_id, owner_id });
      if (!order) throw new NotFoundException('Order not found');
      return order;
    } catch (error) {
      throw error;
    }
  }

  async updateOrder(
    order_id: string,
    owner_id: string,
    payload: UpdateOrderDto,
  ): Promise<Order | null> {
    try {
      const response = await runInTransaction(async (session) => {
        const order = await this.update(order_id, owner_id, payload, session);
        if (!order) throw new NotFoundException('Order not found');
        return order;
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getOrders(
    owner_id: string,
    payload: GetOrdersDto,
  ): Promise<PaginateResult<Order>> {
    try {
      const { page = 1, limit = 20, start_date, end_date } = payload;
      let query: GetOrdersInterface = {
        owner_id,
      };
      if (start_date && end_date) {
        query = {
          ...query,
          createdAt: {
            $gte: moment.utc(start_date, 'YYYY-MM-DD').toDate(),
            $lte: moment.utc(end_date, 'YYYY-MM-DD').endOf('day').toDate(),
          },
        };
      }
      const orders = await this.findMany(
        { page, limit },
        {
          ...query,
        },
      );
      return orders;
    } catch (error) {
      throw error;
    }
  }

  async updateProductInOrder(
    product_id: string,
    update_payload: UpdateProductInterface,
  ) {
    try {
      const response = await runInTransaction(async (session) => {
        return await this.orderModel.updateMany(
          { 'products.product_id': product_id },
          {
            $set: {
              'products.$[elem].name': update_payload.name,
              'products.$[elem].description': update_payload.description,
              'products.$[elem].price': update_payload.price,
            },
          },
          {
            arrayFilters: [{ 'elem.product_id': product_id }],
            writeConcern: { w: 'majority' },
            new: true,
            session,
          },
        );
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async cacheMultipleProducts(products: Product[]) {
    const pipeline = [];

    for (const product of products) {
      const key = `product:${product.id}`;
      const ttl = 600; // ten minutes
      pipeline.push(this.cacheManager.set(key, product, { ttl }));
    }
    await Promise.all(pipeline);
  }

  async getCachedProducts(product_ids: string[]) {
    const cached_products = [];
    for (const id of product_ids) {
      const key = `product:${id}`;
      const product = await this.cacheManager.get(key);
      if (product) {
        cached_products.push(product);
      }
    }
    return cached_products;
  }
}
