import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { strongPasswordConfig } from '../../../../config/passwordConfig';

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword(strongPasswordConfig)
  @IsNotEmpty()
  password: string;
}
