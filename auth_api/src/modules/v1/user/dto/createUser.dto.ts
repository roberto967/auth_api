import { Role } from '../../auth/entities/roles.entity';

export class CreateUserDto {
  email!: string;

  passwordHash!: string;

  name!: string;

  role!: Role;
}
