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

  public async signUp(signUpData: SignUpDto): Promise<AuthResponseDto> {
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

    const loginTokens: AuthResponseDto = {
      accessToken: this.tokenService.createAccessToken(newUser),
      refreshToken: await this.tokenService.createRefreshToken(newUser),
    };

    return loginTokens;
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
