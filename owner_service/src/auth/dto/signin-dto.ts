import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SigninDto {
  @ApiProperty({ description: 'Email of User', type: String })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Password of User', type: String })
  @IsString()
  @MinLength(6, { message: 'password must be at least six characters long' })
  @IsNotEmpty()
  password: string;
}
