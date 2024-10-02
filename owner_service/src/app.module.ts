import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { OwnersModule } from './owners/owners.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration available globally
    }),
    DatabaseModule,
    RabbitMQModule,
    AuthModule,
    OwnersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
