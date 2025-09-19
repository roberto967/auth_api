import { IsNotEmpty, IsStrongPassword } from 'class-validator';
import { strongPasswordConfig } from '../../../../config/passwordConfig';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsStrongPassword(strongPasswordConfig)
  newPassword: string;

  @IsNotEmpty()
  @IsStrongPassword(strongPasswordConfig)
  currentPassword: string;
}
