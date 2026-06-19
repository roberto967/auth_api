import { JwtPayload as LibraryPayload } from 'jsonwebtoken';

export interface AccessTokenPayload extends LibraryPayload {
  sub: string;
  email: string;
}

export interface RefreshTokenPayload extends LibraryPayload {
  sub: string;
  email: string;
}
