import { Module, Global } from '@nestjs/common';
import { ProductModule } from './products/product.module';

@Global()
@Module({
  imports: [ProductModule],
  providers: [],
  exports: [],
})
export class ConsumersModule {}
