import {
  Injectable,
  Inject,
  NotFoundException,
  // ForbiddenException,
} from '@nestjs/common';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import {
  UpdateOwnerInterface,
  CreateOwnerInterface,
  GetOwnersInterface,
  Owner,
} from './interfaces/owner.interface';
import runInTransaction from 'src/common/utils/runInTransaction';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import {
  PaginateModel,
  PaginateResult,
  ClientSession,
  FilterQuery,
} from 'mongoose';

@Injectable()
export class OwnersService {
  constructor(
    @Inject('OWNER_MODEL') private readonly ownerModel: PaginateModel<Owner>,
    private readonly rabitmqService: RabbitmqService,
  ) {}

  async create(
    payload: CreateOwnerInterface,
    session: ClientSession,
  ): Promise<Owner> {
    try {
      const owner = await new this.ownerModel({
        ...payload,
      }).save({ session });
      return owner;
    } catch (error) {
      throw error;
    }
  }

  async findMany(
    payload: GetOwnersInterface,
    query: FilterQuery<Owner>,
  ): Promise<PaginateResult<Owner>> {
    try {
      const { page = 1, limit = 20 } = payload;
      const owners = await this.ownerModel.paginate(query, {
        page,
        limit,
        sort: { createdAt: -1 },
      });
      return owners;
    } catch (error) {
      throw error;
    }
  }

  async findOne(
    query: FilterQuery<Owner>,
    select?: string,
  ): Promise<Owner | null> {
    try {
      const fields = select || [];
      const owner = await this.ownerModel.findOne(query).select(fields);
      return owner;
    } catch (error) {
      throw error;
    }
  }

  async getOwner(owner_id: string): Promise<Owner | null> {
    try {
      const owner = await this.findOne({ _id: owner_id });
      if (!owner) throw new NotFoundException('Owner not found');
      return owner;
    } catch (error) {
      throw error;
    }
  }

  async update(
    owner_id: string,
    payload: UpdateOwnerInterface,
    session?: ClientSession,
    select?: string,
  ): Promise<Owner | null> {
    try {
      const fields = select || [];
      const owner = await this.ownerModel
        .findOneAndUpdate(
          { _id: owner_id },
          {
            ...payload,
          },
          { new: true, session: session || null },
        )
        .select(fields);
      return owner;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(
    owner_id: string,
    payload: UpdateOwnerDto,
  ): Promise<Owner | null> {
    try {
      const response = await runInTransaction(async (session) => {
        const owner = await this.update(
          owner_id,
          payload,
          session,
          '-password -login_times',
        );
        if (!owner) throw new NotFoundException('Owner not found');
        await this.rabitmqService.publishMessage([
          {
            worker: 'product',
            message: {
              action: 'update',
              type: 'product_owner_details',
              data: {
                owner_id,
              },
            },
          },
        ]);
        return owner;
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
}
