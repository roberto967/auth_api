import { injectable } from 'tsyringe';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '../../../common/decorator/injectRepository.decorator';
import { CreateUserDto } from './dto/createUser.dto';

@injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser: User = this.userRepository.create(createUserDto);

    return await this.userRepository.save(newUser);
  }

  public async findOneById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });

    return user;
  }

  public async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email });

    return user;
  }
}
