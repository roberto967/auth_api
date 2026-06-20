import { IsEmail, IsNotEmpty } from 'class-validator';
import { Example } from 'tsoa';

export class LoginUserDto {
  @Example('john.doe@example.com')
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @Example('P@ssw0rd!')
  // @IsStrongPassword(strongPasswordConfig)
  @IsNotEmpty()
  password!: string;
}
