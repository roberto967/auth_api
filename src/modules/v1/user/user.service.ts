import { injectable } from 'tsyringe';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '../../../common/decorators/InjectRepository';

@injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public createUser(): string {
    return 'user created';
  }

  public async findUserById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });

    return user;
  }

  public async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }
}
