import { Role } from '../../auth/entities/roles.entity';

export class CreateUserDto {
  email!: string;

  role!: Role;

  name?: string | null;

  passwordHash?: string | null;

  provider?: string;

  providerId?: string | null;
}
