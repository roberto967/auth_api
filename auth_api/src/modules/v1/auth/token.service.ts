import { injectable } from 'tsyringe';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refreshTokens.entity';
import { UserToken } from './entities/confirmationToken.entity';
import { UserTokenType } from './enum/userTokenTypes.enum';
import { User } from '../user/entities/user.entity';
import jwt from 'jsonwebtoken';
import { tokenConfig, tokenDurationConfig } from '../../../config/env';
import { AccessTokenPayload } from './interfaces/token.types';
import { InjectRepository } from '../../../common/decorator/InjectRepository.decorator';
import { InjectService } from '../../../common/decorator/InjectService.decorator';
import { CryptoService } from './crypto.service';
import { UnauthorizedError } from '../../../error/custom.error';

const CONFIRMATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

@injectable()
export class TokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,

    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,

    @InjectService(CryptoService)
    private readonly cryptoService: CryptoService,
  ) {}

  createAccessToken(user: User): string {
    const payload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
      tokenVersion: user.tokenVersion,
    };

    return jwt.sign(payload, tokenConfig.ACCESS_TOKEN_SECRET, {
      expiresIn: Math.floor(
        tokenDurationConfig.ACCESS_TOKEN_DURATION_MS / 1000,
      ), // Convert ms to seconds
    });
  }

  async rotateRefreshToken(
    rawToken: string,
  ): Promise<{ user: User; newRawToken: string }> {
    const tokenHash = this.cryptoService.hashToken(rawToken);

    const tokenEntity = await this.refreshTokenRepository.findOne({
      where: { tokenHash },
      relations: { user: true },
    });

    if (!tokenEntity) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    if (tokenEntity.isExpired()) {
      await this.refreshTokenRepository.delete({ id: tokenEntity.id });
      throw new UnauthorizedError('Refresh token expired');
    }

    const newRawToken = await this.createRefreshToken(tokenEntity.user);

    return { user: tokenEntity.user, newRawToken };
  }

  async createConfirmationToken(user: User): Promise<string> {
    await this.userTokenRepository.delete({
      user: { id: user.id },
      type: UserTokenType.ACCOUNT_CONFIRMATION,
    });

    const [rawToken, tokenHash] = this.cryptoService.generateAndHashToken();

    const tokenEntity = this.userTokenRepository.create({
      tokenHash,
      user,
      type: UserTokenType.ACCOUNT_CONFIRMATION,
      expiresAt: new Date(Date.now() + CONFIRMATION_TOKEN_TTL_MS),
    });

    await this.userTokenRepository.save(tokenEntity);

    return rawToken;
  }

  async validateAndConsumeConfirmationToken(rawToken: string): Promise<User> {
    const tokenHash = this.cryptoService.hashToken(rawToken);

    const tokenEntity = await this.userTokenRepository.findOne({
      where: { tokenHash, type: UserTokenType.ACCOUNT_CONFIRMATION },
      relations: { user: true },
    });

    if (!tokenEntity) {
      throw new UnauthorizedError('Invalid confirmation token');
    }

    if (tokenEntity.isExpired()) {
      await this.userTokenRepository.delete({ id: tokenEntity.id });
      throw new UnauthorizedError('Confirmation token expired');
    }

    await this.userTokenRepository.delete({ id: tokenEntity.id });

    return tokenEntity.user;
  }

  async revokeRefreshToken(user: User): Promise<void> {
    await this.refreshTokenRepository.delete({ user });
  }

  async createRefreshToken(user: User): Promise<string> {
    await this.refreshTokenRepository.delete({ user: user });

    const [rawToken, tokenHash] = this.cryptoService.generateAndHashToken();

    const tokenEntity = this.refreshTokenRepository.create({
      tokenHash,
      user: user,
      expiresAt: new Date(
        Date.now() + tokenDurationConfig.REFRESH_TOKEN_DURATION_MS,
      ),
    });

    await this.refreshTokenRepository.save(tokenEntity);

    return rawToken;
  }
}
