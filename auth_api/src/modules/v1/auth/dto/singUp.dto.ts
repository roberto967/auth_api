import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { strongPasswordConfig } from '../../../../config/passwordConfig';
import { Example } from 'tsoa';

export class SignUpDto {
  @Example('John Doe')
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  name!: string;

  @Example('john.doe@example.com')
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @Example('P@ssw0rd!')
  @IsStrongPassword(strongPasswordConfig)
  @IsNotEmpty()
  password!: string;
}
