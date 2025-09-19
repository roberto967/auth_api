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

@injectable()
@Route('auth')
@Tags('Authentication')
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
}
