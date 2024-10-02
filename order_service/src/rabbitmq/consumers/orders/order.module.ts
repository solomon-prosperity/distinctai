import { Module, Global } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderWorkerService } from './order.worker.service';
import { ConfigService } from '@nestjs/config';
import { Mongoose } from 'mongoose';
import { OrderSchema } from 'src/orders/schemas/order.schema';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';
import { OrdersService } from 'src/orders/orders.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { DatabaseModule } from 'src/database/database.module';
import { ProductsGrpcService } from 'src/common/services/products-grpc-client.service';

@Global()
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
          protoPath: join(
            __dirname,
            '../../../../../proto/product/product.proto',
          ),
        },
      },
    ]),
  ],
  providers: [
    OrderService,
    OrderWorkerService,
    ConfigService,
    OrdersService,
    RabbitmqService,
    ProductsGrpcService,
    {
      provide: 'ORDER_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('Order', OrderSchema),
      inject: ['DATABASE_CONNECTION'],
    },
  ],
  exports: [OrderWorkerService],
})
export class OrderModule {}
