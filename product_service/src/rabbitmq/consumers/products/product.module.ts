import { Module, Global } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductWorkerService } from './product.worker.service';
import { ProductsService } from 'src/products/products.service';
import { OwnersGrpcService } from 'src/common/services/owners-grpc-client.service';
import { ConfigService } from '@nestjs/config';
import { Mongoose } from 'mongoose';
import { ProductSchema } from 'src/products/schemas/product.schema';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { DatabaseModule } from 'src/database/database.module';

@Global()
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
          protoPath: join(__dirname, '../../../../../proto/owner/owner.proto'),
        },
      },
    ]),
  ],
  providers: [
    ProductService,
    ProductWorkerService,
    ConfigService,
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
  exports: [ProductWorkerService],
})
export class ProductModule {}
