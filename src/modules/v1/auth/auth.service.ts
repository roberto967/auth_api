import { injectable } from 'tsyringe';
import { CryptoService } from './crypto.service';
import { UserService } from '../user/user.service';
import { TokenService } from './token.service';
import { SignUpDto } from './dto/singUp.dto';
import { HttpError } from '../../../error/http.error';
import { HttpErrors } from '../../../common/Enum/httpsErros.enum';
import { AuthResponseDto } from './dto/authResponse.dto';
import { UserRole } from './enum/userRole.enum';
import { PermissionsService } from './permissions.service';
import { InjectService } from '../../../common/decorator/InjectServices.decorator';

@injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,

    private readonly cryptoService: CryptoService,

    private readonly tokenService: TokenService,

    private readonly permissionsService: PermissionsService,
  ) {}

  public async signUp(signUpData: SignUpDto) {
    const user = await this.userService.findUserByEmail(signUpData.email);
    if (user) {
      throw new HttpError(
        'ValidationError',
        HttpErrors.BadRequest,
        'Email already in use',
      );
    }

    const hashedPassword = await this.cryptoService.hashPassword(
      signUpData.password,
    );

    const initialRole = await this.permissionsService.findRoleByName(
      UserRole.USER,
    );

    const newUser = await this.userService.createUser({
      ...signUpData,
      password: hashedPassword,
      role: initialRole,
    });

    const loginTokens: AuthResponseDto = {
      accessToken: this.tokenService.createAccessToken(newUser),
      refreshToken: await this.tokenService.createRefreshToken(newUser),
    };

    return loginTokens;
  }
}
