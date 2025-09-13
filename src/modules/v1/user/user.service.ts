import { injectable } from 'tsyringe';

@injectable()
export class UserService {
  public createUser(): string {
    return 'user created';
  }
}
