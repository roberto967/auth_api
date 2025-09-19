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
} from 'tsoa';
import { SignUpDto } from './dto/singUp.dto';
import { AuthResponseDto } from './dto/authResponse.dto';
import { InjectService } from '../../../common/decorator/injectServices.decorator';
import { validateDto } from './middleware/validation.middleware';
import {
  conflictErrorExample,
  validationErrorExample,
} from '../../../error/example/validation.example';
import { HttpErrors } from '../../../common/Enum/httpsErros.enum';
import { unexpectedErrorExample } from '../../../error/example/unexpected.example';
import { IErrorResponse } from '../../../error/interface/error.interface';
import { LoginUserDto } from './dto/loginLocal.dto';
import {
  forbiddenErrorExample,
  invalidCredentialsErrorExample,
} from '../../../error/example/unauthorized.example';

@injectable()
@Route('auth')
@Tags('Authentication')
export class AuthController {
  constructor(
    @InjectService(AuthService)
    private readonly authService: AuthService,
  ) {}

  /**
   *  Register a new user in the system.
   * If successful, returns a pair of access and update tokens.
   * @summary User Registration
   * @param signUpData Object containing the data required to create the new user's account (e.g., name, email, password).
   * @returns An object containing the access and refresh tokens for the newly created user.
   */
  @SuccessResponse('201', 'Created')
  @Response<IErrorResponse>(
    HttpErrors.BadRequest,
    'Validation Failed',
    validationErrorExample,
  )
  @Response<IErrorResponse>(
    500,
    'Internal Server Error',
    unexpectedErrorExample,
  )
  @Response<IErrorResponse>(
    HttpErrors.Conflict,
    'Conflict Error',
    conflictErrorExample,
  )
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
   * @param loginData Object containing the user's login credentials (email and password).
   * @returns An object containing the access and refresh tokens.
   */
  @SuccessResponse('200', 'OK')
  @Response<IErrorResponse>(
    HttpErrors.BadRequest,
    'Validation Failed',
    validationErrorExample,
  )
  @Response<IErrorResponse>(
    500,
    'Internal Server Error',
    unexpectedErrorExample,
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
  @Middlewares(validateDto(LoginUserDto))
  public async signIn(
    @Body() loginData: LoginUserDto,
  ): Promise<AuthResponseDto> {
    const tokens = await this.authService.login(loginData);

    return tokens;
  }
}
