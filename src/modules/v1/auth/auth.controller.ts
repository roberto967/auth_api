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
import { InjectService } from '../../../common/decorator/InjectServices.decorator';
import { validateDto } from './middleware/validation.middleware';
import { validationErrorExample } from './interfaces/errorResponse.interface';
import { HttpError } from '../../../error/http.error';

@injectable()
@Route('auth')
@Tags('Authentication')
export class AuthController {
  constructor(
    @InjectService(AuthService)
    private readonly authService: AuthService,
  ) {}

  @SuccessResponse('201', 'Created')
  @Response<HttpError>(400, 'Validation Failed', validationErrorExample)
  @Post('signup')
  @Middlewares(validateDto(SignUpDto))
  public async signUp(@Body() signUpData: SignUpDto): Promise<AuthResponseDto> {
    const tokens = await this.authService.signUp(signUpData);

    return tokens;
  }
}
