import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { OwnersService } from 'src/owners/owners.service';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { Mongoose } from 'mongoose';
import { OwnerSchema } from 'src/owners/schemas/owner.schema';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DatabaseModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRY_TIME'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    AuthService,
    OwnersService,
    RabbitmqService,
    {
      provide: 'OWNER_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('Owner', OwnerSchema),
      inject: ['DATABASE_CONNECTION'],
    },
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
