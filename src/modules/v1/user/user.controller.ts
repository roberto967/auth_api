import { Controller, Get, Route, Tags } from 'tsoa';
import { injectable } from 'tsyringe';
import { UserService } from './user.service';
import { HttpError } from '../../../error/http.error';

@injectable()
@Route('users')
@Tags('Usuários')
export class UsersController extends Controller {
  constructor(private readonly userService: UserService) {
    super();
  }

  @Get()
  public createUser(): string {
    return this.userService.createUser();
  }

  @Get('throw')
  public throwError(): void {
    throw new HttpError(400, 'This is a test error');
  }
}
