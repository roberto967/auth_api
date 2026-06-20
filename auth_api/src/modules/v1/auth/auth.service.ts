import { injectable } from 'tsyringe';
import { CryptoService } from './crypto.service';
import { UserService } from '../user/user.service';
import { TokenService } from './token.service';
import { SignUpDto } from './dto/singUp.dto';
import { AuthResponseDto } from './dto/authResponse.dto';
import { PermissionsService } from './permissions.service';
import { InjectService } from '../../../common/decorator/InjectService.decorator';
import { ConflictError, ForbiddenError } from '../../../error/custom.error';
import { User } from '../user/entities/user.entity';
import { UserStatus } from '../user/enums/userStatus.enum';

@injectable()
export class AuthService {
  constructor(
    @InjectService(UserService)
    private readonly userService: UserService,

    @InjectService(CryptoService)
    private readonly cryptoService: CryptoService,

    @InjectService(TokenService)
    private readonly tokenService: TokenService,

    @InjectService(PermissionsService)
    private readonly permissionsService: PermissionsService,
  ) {}

  public async signUp(signUpData: SignUpDto): Promise<void> {
    const user = await this.userService.findUserByEmail(signUpData.email);
    if (user) {
      throw new ConflictError('Error in registration', [
        'email already in use',
      ]);
    }

    const hashedPassword = await this.cryptoService.hashPassword(
      signUpData.password,
    );

    const initialRole = await this.permissionsService.findRoleByName('user');

    const newUser = await this.userService.createUser({
      ...signUpData,
      passwordHash: hashedPassword,
      role: initialRole,
    });

    const confirmationToken =
      await this.tokenService.createConfirmationToken(newUser);

    console.log(
      `[EMAIL MOCK] To: ${newUser.email} | Confirmation token: ${confirmationToken}`,
    );
  }

  public async confirmEmail(rawToken: string): Promise<AuthResponseDto> {
    const user =
      await this.tokenService.validateAndConsumeConfirmationToken(rawToken);

    const activeUser = await this.userService.activateUser(user.id);

    return {
      accessToken: this.tokenService.createAccessToken(activeUser),
      refreshToken: await this.tokenService.createRefreshToken(activeUser),
    };
  }

  public async refresh(rawToken: string): Promise<AuthResponseDto> {
    const { user, newRawToken } =
      await this.tokenService.rotateRefreshToken(rawToken);

    if (
      user.status === UserStatus.INACTIVE ||
      user.status === UserStatus.BANNED ||
      user.status === UserStatus.PENDING_VERIFICATION
    ) {
      await this.tokenService.revokeRefreshToken(user);
      throw new ForbiddenError(
        'Your account is not active. Please contact support.',
        [],
      );
    }

    return {
      accessToken: this.tokenService.createAccessToken(user),
      refreshToken: newRawToken,
    };
  }

  public async logout(user: User): Promise<void> {
    await this.tokenService.revokeRefreshToken(user);
    await this.userService.incrementTokenVersion(user.id);
  }

  public async login(user: User): Promise<AuthResponseDto> {
    if (
      user.status === UserStatus.INACTIVE ||
      user.status === UserStatus.BANNED ||
      user.status === UserStatus.PENDING_VERIFICATION
    ) {
      throw new ForbiddenError(
        'Your account is not active. Please contact support.',
        [],
      );
    }

    const loginTokens: AuthResponseDto = {
      accessToken: this.tokenService.createAccessToken(user),
      refreshToken: await this.tokenService.createRefreshToken(user),
    };

    return loginTokens;
  }
}
