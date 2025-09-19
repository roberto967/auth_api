import { Example } from 'tsoa';

export class AuthResponseDto {
  @Example('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')
  accessToken: string;

  @Example('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')
  refreshToken: string;
}
