import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PhoneNumberDto } from './phone-number-dto';

export class SignupDto {
  @ApiProperty({ description: 'First Name of Owner', type: String })
  @IsString()
  @MinLength(2, { message: 'first_name must be at least two characters long' })
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ description: 'Phone Number of Owner', type: PhoneNumberDto })
  @ValidateNested()
  @Type(() => PhoneNumberDto)
  @IsNotEmpty()
  phone_number: PhoneNumberDto;

  @ApiProperty({ description: 'Email of Owner', type: String })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Last Name of Owner', type: String })
  @IsString()
  @MinLength(2, { message: 'last_name must be at least two characters long' })
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ description: 'Address of Owner', type: String })
  @IsString()
  @MinLength(2, { message: 'address must be at least two characters long' })
  @IsNotEmpty()
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
  date_of_birth: string;

  @ApiProperty({ description: 'Password of User', type: String })
  @IsString()
  @MinLength(6, { message: 'password must be at least six characters long' })
  @IsNotEmpty()
  password: string;
}
