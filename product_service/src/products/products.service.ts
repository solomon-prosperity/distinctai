import {
  Injectable,
  Inject,
  NotFoundException,
  // ForbiddenException,
} from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product-dto';
import { GetProductsDto } from './dto/get-products.dto';
import {
  UpdateProductInterface,
  GetProductsInterface,
  Product,
} from './interfaces/product.interface';
import runInTransaction from 'src/common/utils/runInTransaction';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import {
  UpdateWriteOpResult,
  PaginateModel,
  PaginateResult,
  ClientSession,
  FilterQuery,
} from 'mongoose';
import * as moment from 'moment';
import { OwnersGrpcService } from 'src/common/services/owners-grpc-client.service';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUCT_MODEL')
    private readonly productModel: PaginateModel<Product>,
    private readonly rabitmqService: RabbitmqService,
    private readonly ownersGrpcService: OwnersGrpcService,
  ) {}

  async create(owner_id: string, payload: CreateProductDto): Promise<Product> {
    try {
      const response = await runInTransaction(async (session) => {
        const owner = await this.ownersGrpcService.getOwner(owner_id);
        const { first_name, last_name, address, email } = owner;
        const product = await new this.productModel({
          owner_id,
          owner_details: { first_name, last_name, address, email },
          ...payload,
        }).save({ session });
        return product;
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async findMany(
    query: FilterQuery<Product>,
    query_options?: GetProductsInterface,
  ): Promise<PaginateResult<Product>> {
    try {
      let products;
      if (query_options) {
        const { page = 1, limit = 20 } = query_options;
        products = await this.productModel.paginate(query, {
          page,
          limit,
          sort: { createdAt: -1 },
        });
      } else {
        products = this.productModel.paginate(query);
      }

      return products;
    } catch (error) {
      throw error;
    }
  }

  async findOne(
    query: FilterQuery<Product>,
    select?: string,
  ): Promise<Product | null> {
    try {
      const fields = select || [];
      const product = await this.productModel.findOne(query).select(fields);
      return product;
    } catch (error) {
      throw error;
    }
  }

  async update(
    product_id: string,
    owner_id: string,
    payload: UpdateProductInterface,
    session?: ClientSession,
    select?: string,
  ): Promise<Product | null> {
    try {
      const fields = select || [];
      const product = await this.productModel
        .findOneAndUpdate(
          { _id: product_id, owner_id },
          {
            ...payload,
          },
          {
            new: true,
            session: session || null,
          },
        )
        .select(fields);
      return product;
    } catch (error) {
      throw error;
    }
  }

  async getProduct(
    product_id: string,
    owner_id: string,
  ): Promise<Product | null> {
    try {
      const product = await this.findOne({ _id: product_id, owner_id });
      if (!product) throw new NotFoundException('Product not found');
      return product;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(
    product_id: string,
    owner_id: string,
    payload: UpdateProductDto,
  ): Promise<Product | null> {
    try {
      const response = await runInTransaction(async (session) => {
        const product = await this.update(
          product_id,
          owner_id,
          payload,
          session,
        );
        if (!product) throw new NotFoundException('Product not found');
        await this.rabitmqService.publishMessage([
          {
            worker: 'order',
            message: {
              action: 'update',
              type: 'order_product_details',
              data: {
                product_id,
              },
            },
          },
        ]);
        return product;
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateProducts(
    owner_id: string,
    payload: UpdateProductInterface,
  ): Promise<UpdateWriteOpResult> {
    try {
      const response = await runInTransaction(async (session) => {
        const products = await this.productModel.updateMany(
          { owner_id },
          payload,
          { session },
        );
        return products;
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getProducts(
    owner_id: string,
    payload: GetProductsDto,
  ): Promise<PaginateResult<Product>> {
    try {
      const { page = 1, limit = 20, start_date, end_date } = payload;
      let query: GetProductsInterface = {
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
      const products = await this.findMany(
        {
          ...query,
        },
        { page, limit },
      );
      return products;
    } catch (error) {
      throw error;
    }
  }
}
