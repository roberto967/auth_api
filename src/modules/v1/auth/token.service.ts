import { injectable } from 'tsyringe';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refreshTokens.entity';
import { User } from '../user/entities/user.entity';
import jwt from 'jsonwebtoken';
import { tokenConfig } from '../../../config/env';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from './interfaces/token.types';

@injectable()
export class TokenService {
  constructor(private readonly tokenRepository: Repository<RefreshToken>) {}

  createAccessToken(user: User): string {
    const payload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
      tokenVersion: user.tokenVersion,
    };

    return jwt.sign(payload, tokenConfig.ACCESS_TOKEN_SECRET, {
      expiresIn: '15d',
    });
  }

  async createRefreshToken(user: User): Promise<string> {
    await this.tokenRepository.save({ userId: user.id });

    const payload: RefreshTokenPayload = {
      sub: user.id,
      email: user.email,
    };

    return jwt.sign(payload, tokenConfig.REFRESH_TOKEN_SECRET, {
      expiresIn: '7d',
    });
  }
}
