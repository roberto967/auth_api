import { Controller, Get, Middlewares, Route, Tags, Security } from 'tsoa';
import { injectable } from 'tsyringe';
import { UserService } from './user.service';
import { HttpError } from '../../../error/http.error';
import { HttpErrors } from '../../../common/Enum/httpsErros.enum';
import { requirePermissions } from '../auth/middleware/permission.middleware';

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

  @Get('permissao')
  @Security('jwt')
  @Middlewares(requirePermissions(['read:teste']))
  public getPermissions(): string {
    // return this.userService.getPermissions();
    return 'user permissions';
  }

  @Get('throw')
  public throwError(): void {
    throw new HttpError('Teste', HttpErrors.BadRequest, 'This is a test error');
  }
}
