import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { strongPasswordConfig } from '../../../../config/passwordConfig';

export class UpdateUserDto {
  @IsOptional()
  @IsStrongPassword(strongPasswordConfig)
  password?: string;

  @IsOptional()
  @MinLength(1)
  @IsString()
  name?: string;

  @IsOptional()
  @MinLength(1)
  @IsEmail()
  email?: string;
}
