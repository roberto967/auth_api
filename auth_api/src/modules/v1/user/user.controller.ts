import {
  Controller,
  Get,
  Middlewares,
  Route,
  Tags,
  Security,
  SuccessResponse,
  Response,
} from 'tsoa';
import { injectable } from 'tsyringe';
import { UserService } from './user.service';
import { HttpError } from '../../../error/http.error';
import { HttpErrors } from '../../../common/Enum/httpsErrors.enum';
import { requirePermissions } from '../auth/middleware/permission.middleware';
import { IErrorResponse } from '../../../error/interface/error.interface';
import {
  forbiddenErrorExample,
  invalidCredentialsErrorExample,
} from '../../../error/example/unauthorized.example';
import { unexpectedErrorExample } from '../../../error/example/unexpected.example';

@injectable()
@Route('users')
@Tags('Usuários')
@Response<IErrorResponse>(500, 'Internal Server Error', unexpectedErrorExample)
export class UsersController extends Controller {
  constructor(private readonly userService: UserService) {
    super();
  }

  @SuccessResponse('200', 'OK')
  @Response<IErrorResponse>(
    HttpErrors.Unauthorized,
    'Unauthorized',
    invalidCredentialsErrorExample,
  )
  @Response<IErrorResponse>(
    HttpErrors.Forbidden,
    'Forbidden - Missing permission read:teste',
    forbiddenErrorExample,
  )
  @Get('permissao')
  @Security('jwt')
  @Middlewares(requirePermissions(['read:teste']))
  public getPermissions(): string {
    // return this.userService.getPermissions();
    return 'user permissions';
  }

  @Response<IErrorResponse>(HttpErrors.BadRequest, 'Bad Request', {
    name: 'Teste',
    statusCode: HttpErrors.BadRequest,
    message: 'This is a test error',
    details: [],
  })
  @Get('throw')
  public throwError(): void {
    throw new HttpError('Teste', HttpErrors.BadRequest, 'This is a test error');
  }
}
