import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
  ValidateNested,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PhoneNumberDto } from 'src/auth/dto/phone-number-dto';
import { Type } from 'class-transformer';

export class UpdateOwnerDto {
  @ApiProperty({ description: 'First Name of Owner', type: String })
  @IsString()
  @MinLength(2, { message: 'first_name must be at least two characters long' })
  @IsNotEmpty()
  @IsOptional()
  first_name?: string;

  @ApiProperty({ description: 'Phone Number of Owner', type: PhoneNumberDto })
  @ValidateNested()
  @Type(() => PhoneNumberDto)
  @IsNotEmpty()
  @IsOptional()
  phone_number?: PhoneNumberDto;

  @ApiProperty({ description: 'Last Name of Owner', type: String })
  @IsString()
  @MinLength(2, { message: 'last_name must be at least two characters long' })
  @IsNotEmpty()
  @IsOptional()
  last_name: string;

  @ApiProperty({ description: 'Address of Owner', type: String })
  @IsString()
  @MinLength(2, { message: 'address must be at least two characters long' })
  @IsNotEmpty()
  @IsOptional()
  address: string;

  @ApiProperty({
    description: 'Date of Birth of Owner',
    type: String,
    example: '1990-01-01',
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date_of_birth must be in YYYY-MM-DD format',
  })
  @IsNotEmpty()
  @IsOptional()
  date_of_birth?: string;
}
