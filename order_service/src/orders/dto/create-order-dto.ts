import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ description: 'Total Price of Order', type: String })
  @IsNumber()
  @IsNotEmpty()
  total_price: number;

  @ApiProperty({ description: 'Quantity of Order', type: String })
  @IsNumber()
  @IsNotEmpty()
  total_quantity: number;

  @ApiProperty({
    description: 'ID of products for the order',
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  product_ids: string[];
}
