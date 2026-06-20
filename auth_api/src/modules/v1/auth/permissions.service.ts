import { Repository } from 'typeorm';
import { InjectRepository } from '../../../common/decorator/InjectRepository.decorator';
import { Role } from './entities/roles.entity';
import { Permission } from './entities/permission.entity';
import { UserRole } from './enum/userRole.enum';
import { HttpError } from '../../../error/http.error';
import { HttpErrors } from '../../../common/Enum/httpsErrors.enum';
import { injectable } from 'tsyringe';

@injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,

    @InjectRepository(Permission)
    private readonly permissionsRepository: Repository<Permission>,
  ) {}

  public async findRoleByName(role_name: UserRole): Promise<Role> {
    const role = await this.rolesRepository.findOne({
      where: { name: role_name },
      relations: { permissions: true },
    });

    if (!role) {
      throw new HttpError(
        'NotFoundError',
        HttpErrors.NotFound,
        `Role with name ${role_name} not found`,
      );
    }

    return role;
  }
}
