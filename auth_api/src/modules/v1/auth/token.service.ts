import { injectable } from 'tsyringe';
import { LessThan, Repository } from 'typeorm';
import { RefreshToken } from './entities/refreshTokens.entity';
import { ConfirmationToken } from './entities/confirmationToken.entity';
import { User } from '../user/entities/user.entity';
import jwt from 'jsonwebtoken';
import { tokenConfig, tokenDurationConfig } from '../../../config/env';
import { AccessTokenPayload } from './interfaces/token.types';
import { InjectRepository } from '../../../common/decorator/InjectRepository.decorator';
import { InjectService } from '../../../common/decorator/InjectService.decorator';
import { CryptoService } from './crypto.service';
import { UnauthorizedError } from '../../../error/custom.error';

@injectable()
export class TokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,

    @InjectRepository(ConfirmationToken)
    private readonly confirmationTokenRepository: Repository<ConfirmationToken>,

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
      ),
    });
  }

  async validateAndConsumeRefreshToken(rawToken: string): Promise<User> {
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

    await this.refreshTokenRepository.delete({ id: tokenEntity.id });

    return tokenEntity.user;
  }

  async createConfirmationToken(user: User): Promise<string> {
    await this.confirmationTokenRepository.delete({ user: { id: user.id } });

    const [rawToken, tokenHash] = this.cryptoService.generateAndHashToken();

    const tokenEntity = this.confirmationTokenRepository.create({
      tokenHash,
      user,
      expiresAt: new Date(
        Date.now() + tokenDurationConfig.CONFIRMATION_TOKEN_DURATION_MS,
      ),
    });

    await this.confirmationTokenRepository.save(tokenEntity);

    return rawToken;
  }

  async validateAndConsumeConfirmationToken(rawToken: string): Promise<User> {
    const tokenHash = this.cryptoService.hashToken(rawToken);

    const tokenEntity = await this.confirmationTokenRepository.findOne({
      where: { tokenHash },
      relations: { user: true },
    });

    if (!tokenEntity) {
      throw new UnauthorizedError('Invalid confirmation token');
    }

    if (tokenEntity.isExpired()) {
      await this.confirmationTokenRepository.delete({ id: tokenEntity.id });
      throw new UnauthorizedError('Confirmation token expired');
    }

    await this.confirmationTokenRepository.delete({ id: tokenEntity.id });

    return tokenEntity.user;
  }

  async revokeRefreshToken(user: User): Promise<boolean> {
    const result = await this.refreshTokenRepository.delete({ user });
    return (result.affected ?? 0) > 0;
  }

  async createRefreshToken(user: User): Promise<string> {
    await this.refreshTokenRepository.delete({
      user: { id: user.id },
      expiresAt: LessThan(new Date()),
    });

    const [rawToken, tokenHash] = this.cryptoService.generateAndHashToken();

    const tokenEntity = this.refreshTokenRepository.create({
      tokenHash,
      user,
      expiresAt: new Date(
        Date.now() + tokenDurationConfig.REFRESH_TOKEN_DURATION_MS,
      ),
    });

    await this.refreshTokenRepository.save(tokenEntity);

    return rawToken;
  }
}
