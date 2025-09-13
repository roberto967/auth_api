import { inject, injectable } from 'tsyringe';
import { CryptoService } from './crypto.service';
import { UserService } from '../user/user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { TokenService } from './token.service';

@injectable()
export class AuthService {
  constructor(
    @inject('UserService')
    readonly userService: UserService,

    @inject('CryptoService')
    readonly cryptoService: CryptoService,

    @inject('TokenService')
    readonly tokenService: TokenService,
  ) {}

  login(loginDto: LoginUserDto) {
    // const accessToken = this.tokenService.createAccessToken(loginDto);
    // const refreshToken = this.tokenService.createRefreshToken(loginDto);
  }
}
