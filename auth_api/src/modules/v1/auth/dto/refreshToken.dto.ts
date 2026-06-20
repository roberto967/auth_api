import { IsNotEmpty, IsString } from 'class-validator';
import { Example } from 'tsoa';

export class RefreshTokenDto {
  @Example('a3f1b2c4d5e6...')
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
