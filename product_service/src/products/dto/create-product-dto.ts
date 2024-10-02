import { IsString, IsNotEmpty, MinLength, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Name of Product', type: String })
  @IsString()
  @MinLength(2, { message: 'name must be at least two characters long' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Description of Product', type: String })
  @IsString()
  @MinLength(2, { message: 'description must be at least two characters long' })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Price of Product', type: String })
  @IsNumber()
  @IsNotEmpty()
  price: number;
}
