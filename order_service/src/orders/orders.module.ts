import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { Mongoose } from 'mongoose';
import { OrderSchema } from './schemas/order.schema';
import { DatabaseModule } from 'src/database/database.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ProductsGrpcService } from 'src/common/services/products-grpc-client.service';
import { OwnersGrpcService } from 'src/common/services/owners-grpc-client.service';

@Module({
  imports: [
    DatabaseModule,
    ClientsModule.register([
      {
        name: 'PRODUCTPROTO_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: process.env.PRODUCT_SERVICE_GRPC_HOST_PORT,
          package: 'productproto',
          protoPath: join(__dirname, '../../../proto/product/product.proto'),
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'OWNERPROTO_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: process.env.OWNER_SERVICE_GRPC_HOST_PORT,
          package: 'ownerproto',
          protoPath: join(__dirname, '../../../proto/owner/owner.proto'),
        },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    RabbitmqService,
    ProductsGrpcService,
    OwnersGrpcService,
    {
      provide: 'ORDER_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('Order', OrderSchema),
      inject: ['DATABASE_CONNECTION'],
    },
  ],
})
export class OrdersModule {}
