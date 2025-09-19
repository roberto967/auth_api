import { Controller, Get, Route, Tags } from 'tsoa';
import { injectable } from 'tsyringe';
import { UserService } from './user.service';
import { HttpError } from '../../../error/http.error';
import { HttpErrors } from '../../../common/Enum/httpsErros.enum';

@injectable()
@Route('users')
@Tags('Usuários')
export class UsersController extends Controller {
  constructor(private readonly userService: UserService) {
    super();
  }

  @Get()
  public createUser(): string {
    // return this.userService.createUser();
    return 'user created';
  }

  @Get('throw')
  public throwError(): void {
    throw new HttpError('Teste', HttpErrors.BadRequest, 'This is a test error');
  }
}
