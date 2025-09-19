import { Role } from '../../auth/entities/roles.entity';

export class CreateUserDto {
  email: string;

  password: string;

  name: string;

  role: Role;
}
