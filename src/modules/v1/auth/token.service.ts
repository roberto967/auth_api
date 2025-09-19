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
import { InjectRepository } from '../../../common/decorator/injectRepository.decorator';

@injectable()
export class TokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

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
    await this.refreshTokenRepository.delete({ user: user });

    const payload: RefreshTokenPayload = {
      sub: user.id,
      email: user.email,
    };

    const refreshToken = jwt.sign(payload, tokenConfig.REFRESH_TOKEN_SECRET, {
      expiresIn: '7d',
    });

    const tokenEntity = this.refreshTokenRepository.create({
      tokenHash: refreshToken,
      user: user,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    await this.refreshTokenRepository.save(tokenEntity);

    return refreshToken;
  }
}
