import { Module, Global } from '@nestjs/common';
import { OrderModule } from './orders/order.module';

@Global()
@Module({
  imports: [OrderModule],
  providers: [],
  exports: [],
})
export class ConsumersModule {}
