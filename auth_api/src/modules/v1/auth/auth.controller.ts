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
import {
  forbiddenErrorExample,
  invalidCredentialsErrorExample,
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

  /**
   * Register a new user in the system.
   * If successful, returns a pair of access and update tokens.
   * @summary User Registration
   * @param signUpData Object containing the data required to create the new user's account (e.g., name, email, password).
   * @returns An object containing the access and refresh tokens for the newly created user.
   */
  @SuccessResponse('201', 'Created')
  @Response<IErrorResponse>(HttpErrors.BadRequest, 'Validation Failed', validationErrorExample)
  @Response<IErrorResponse>(HttpErrors.Conflict, 'Conflict Error', conflictErrorExample)
  @Post('signup')
  @Middlewares(validateDto(SignUpDto))
  public async signUp(@Body() signUpData: SignUpDto): Promise<AuthResponseDto> {
    const tokens = await this.authService.signUp(signUpData);

    return tokens;
  }

  /**
   * Authenticate a user using their email and password.
   * If successful, returns a pair of access and refresh tokens.
   * @summary User Login
   * @param _loginData Object containing the user's login credentials (email and password).
   * @returns An object containing the access and refresh tokens.
   */
  @SuccessResponse('200', 'OK')
  @Response<IErrorResponse>(HttpErrors.BadRequest, 'Validation Failed', validationErrorExample)
  @Response<IErrorResponse>(HttpErrors.Forbidden, 'Forbidden', forbiddenErrorExample)
  @Response<IErrorResponse>(HttpErrors.Unauthorized, 'Invalid Credentials', invalidCredentialsErrorExample)
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
  @Response<IErrorResponse>(HttpErrors.Unauthorized, 'Unauthorized', invalidCredentialsErrorExample)
  @Post('logout')
  @Security('jwt')
  public async logout(@Request() req: ExpressRequest): Promise<string> {
    const user = req.user as User;

    return user.name;
  }
}
