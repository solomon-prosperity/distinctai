import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { OwnersGrpcService } from 'src/common/services/owners-grpc-client.service';
import { ProductsController } from './products.controller';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { Mongoose } from 'mongoose';
import { ProductSchema } from './schemas/product.schema';
import { DatabaseModule } from 'src/database/database.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ProductsGrpcController } from './products-grpc.controller';

@Module({
  imports: [
    DatabaseModule,
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
  controllers: [ProductsController, ProductsGrpcController],
  providers: [
    ProductsService,
    RabbitmqService,
    OwnersGrpcService,
    {
      provide: 'PRODUCT_MODEL',
      useFactory: (mongoose: Mongoose) =>
        mongoose.model('Product', ProductSchema),
      inject: ['DATABASE_CONNECTION'],
    },
  ],
})
export class ProductsModule {}
