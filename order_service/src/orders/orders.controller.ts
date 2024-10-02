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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order-dto';
import { GetOrdersDto } from './dto/get-orders.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Owner } from 'src/common/utils/interfaces';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { VerifyTokenGuard } from '../common/guards/verify-token.guard';

@ApiTags('Orders')
@ApiBearerAuth('access-token')
@UseGuards(VerifyTokenGuard)
@Controller('/v1/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Create an order' })
  @ApiBody({ type: CreateOrderDto })
  @Post()
  async create(
    @Body() payload: CreateOrderDto,
    @CurrentUser() currentUser: Owner,
  ) {
    const response = await this.ordersService.create(currentUser.id, payload);
    return {
      response: response,
      message: 'Order created successfully!',
    };
  }

  @ApiOperation({ summary: 'Get Orders' })
  // @ApiQuery({ type: GetOrdersDto })
  @Get()
  async getOrders(
    @CurrentUser() currentUser: Owner,
    @Query() payload: GetOrdersDto,
  ) {
    const response = await this.ordersService.getOrders(
      currentUser.id,
      payload,
    );
    return {
      response: response,
      message: 'Orders retrieved successfully!',
    };
  }

  @ApiOperation({ summary: 'Get an Order' })
  @ApiParam({ name: 'order_id', description: 'ID of the order' })
  @Get(':order_id')
  async getOrder(
    @CurrentUser() currentUser: Owner,
    @Param('order_id') order_id: string,
  ) {
    const response = await this.ordersService.getOrder(
      order_id,
      currentUser.id,
    );
    return {
      response: response,
      message: 'Order retrieved successfully!',
    };
  }

  @ApiOperation({ summary: 'Update an order' })
  @ApiParam({ name: 'order_id', description: 'ID of the order' })
  @ApiBody({ type: UpdateOrderDto })
  @Put(':order_id')
  async updateProfile(
    @CurrentUser() currentUser: Owner,
    @Param('order_id') order_id: string,
    @Body() payload: UpdateOrderDto,
  ) {
    const response = await this.ordersService.updateOrder(
      order_id,
      currentUser.id,
      payload,
    );
    return {
      response: response,
      message: 'Order updated successfully!',
    };
  }
}
