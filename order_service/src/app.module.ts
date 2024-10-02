import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { DatabaseModule } from './database/database.module';
import { OrdersModule } from './orders/orders.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration available globally
    }),
    CacheModule.registerAsync({
      useFactory: () => {
        return {
          store: redisStore,
          url: process.env.REDIS_URL || 'redis://localhost:6379',
        } as RedisClientOptions;
      },
      isGlobal: true,
    }),
    CacheModule.register(),
    DatabaseModule,
    RabbitMQModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
