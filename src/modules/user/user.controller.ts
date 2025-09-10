import { Controller, Get, Route, Tags } from 'tsoa';
import { injectable } from 'tsyringe';
import { UserService } from './user.service';

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
}
