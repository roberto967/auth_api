import { injectable } from 'tsyringe';
import { AuthService } from './auth.service';
import {
  Body,
  Middlewares,
  Post,
  Route,
  SuccessResponse,
  Tags,
  Response,
  Request,
  Security,
} from 'tsoa';
import { SignUpDto } from './dto/singUp.dto';
import { AuthResponseDto } from './dto/authResponse.dto';
import { InjectService } from '../../../common/decorator/InjectService.decorator';
import { validateDto } from './middleware/validation.middleware';
import {
  conflictErrorExample,
  validationErrorExample,
} from '../../../error/example/validation.example';
import { HttpErrors } from '../../../common/Enum/httpsErrors.enum';
import { unexpectedErrorExample } from '../../../error/example/unexpected.example';
import { IErrorResponse } from '../../../error/interface/error.interface';
import { LoginUserDto } from './dto/loginLocal.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { ConfirmEmailDto } from './dto/confirmEmail.dto';
import {
  expiredRefreshTokenExample,
  forbiddenErrorExample,
  invalidCredentialsErrorExample,
  invalidConfirmationTokenExample,
  invalidRefreshTokenExample,
} from '../../../error/example/unauthorized.example';
import { localAuthMiddleware } from './middleware/auth.middleware';
import { Request as ExpressRequest } from 'express';
import { User } from '../user/entities/user.entity';

@injectable()
@Route('auth')
@Tags('Authentication')
@Response<IErrorResponse>(500, 'Internal Server Error', unexpectedErrorExample)
export class AuthController {
  constructor(
    @InjectService(AuthService)
    private readonly authService: AuthService,
  ) {}

  @SuccessResponse('201', 'Created')
  @Response<IErrorResponse>(
    HttpErrors.BadRequest,
    'Validation Failed',
    validationErrorExample,
  )
  @Response<IErrorResponse>(
    HttpErrors.Conflict,
    'Conflict Error',
    conflictErrorExample,
  )
  @Post('signup')
  @Middlewares(validateDto(SignUpDto))
  public async signUp(@Body() signUpData: SignUpDto): Promise<void> {
    await this.authService.signUp(signUpData);
  }

  @SuccessResponse('200', 'OK')
  @Response<IErrorResponse>(
    HttpErrors.BadRequest,
    'Validation Failed',
    validationErrorExample,
  )
  @Response<IErrorResponse>(
    HttpErrors.Unauthorized,
    'Invalid or expired confirmation token',
    invalidConfirmationTokenExample,
  )
  @Post('confirm-email')
  @Middlewares(validateDto(ConfirmEmailDto))
  public async confirmEmail(
    @Body() body: ConfirmEmailDto,
  ): Promise<AuthResponseDto> {
    return this.authService.confirmEmail(body.token);
  }

  @SuccessResponse('200', 'OK')
  @Response<IErrorResponse>(
    HttpErrors.BadRequest,
    'Validation Failed',
    validationErrorExample,
  )
  @Response<IErrorResponse>(
    HttpErrors.Forbidden,
    'Forbidden',
    forbiddenErrorExample,
  )
  @Response<IErrorResponse>(
    HttpErrors.Unauthorized,
    'Invalid Credentials',
    invalidCredentialsErrorExample,
  )
  @Post('login')
  @Middlewares(validateDto(LoginUserDto), localAuthMiddleware)
  public async signIn(
    @Request() req: ExpressRequest,

    @Body() _loginData: LoginUserDto,
  ): Promise<AuthResponseDto> {
    const user = req.user as User;

    const tokens = await this.authService.login(user);

    return tokens;
  }

  @SuccessResponse('200', 'OK')
  @Response<IErrorResponse>(
    HttpErrors.BadRequest,
    'Validation Failed',
    validationErrorExample,
  )
  @Response<IErrorResponse>(
    HttpErrors.Unauthorized,
    'Invalid refresh token',
    invalidRefreshTokenExample,
  )
  @Response<IErrorResponse>(
    HttpErrors.Unauthorized,
    'Refresh token expired',
    expiredRefreshTokenExample,
  )
  @Response<IErrorResponse>(
    HttpErrors.Forbidden,
    'Account inactive or banned',
    forbiddenErrorExample,
  )
  @Post('refresh')
  @Middlewares(validateDto(RefreshTokenDto))
  public async refresh(
    @Body() body: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    return this.authService.refresh(body.refreshToken);
  }

  @SuccessResponse('204', 'No Content')
  @Response<IErrorResponse>(
    HttpErrors.Unauthorized,
    'Unauthorized',
    invalidCredentialsErrorExample,
  )
  @Post('logout')
  @Security('jwt')
  public async logout(@Request() req: ExpressRequest): Promise<void> {
    const user = req.user as User;
    await this.authService.logout(user);
  }
}
