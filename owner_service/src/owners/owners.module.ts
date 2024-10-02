import { Module } from '@nestjs/common';
import { OwnersService } from './owners.service';
import { OwnersController } from './owners.controller';
import { OwnersGrpcController } from './owners-grpc.controller';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { Mongoose } from 'mongoose';
import { OwnerSchema } from './schemas/owner.schema';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [OwnersController, OwnersGrpcController],
  providers: [
    OwnersService,
    AuthService,
    JwtService,
    RabbitmqService,
    {
      provide: 'OWNER_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('Owner', OwnerSchema),
      inject: ['DATABASE_CONNECTION'],
    },
  ],
})
export class OwnersModule {}
