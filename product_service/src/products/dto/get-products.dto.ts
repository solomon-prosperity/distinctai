import {
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
  ValidateIf,
  IsNotEmpty,
  //   Validate,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsGreaterThan } from 'src/common/decorators/greater-than.decorator';

export class GetProductsDto {
  @ApiPropertyOptional({ description: 'Page Number', type: String })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Products per page', type: String })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Filter products by date created',
    type: String,
  })
  @IsOptional()
  @IsDateString({ strict: true })
  start_date: string;

  @ApiPropertyOptional({
    description: 'Filter products by date created',
    type: String,
  })
  @ValidateIf((o) => o.startDate)
  @IsDateString({ strict: true })
  @IsNotEmpty()
  @IsGreaterThan('startDate', {
    message: 'end_date must be greater than startDate',
  })
  end_date: string;
}
