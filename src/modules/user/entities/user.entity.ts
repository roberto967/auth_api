import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { UserStatus } from '../enums/userStatus.enum';
import { UserToken } from '../../auth/entities/confirmationToken.entity';
import { RefreshToken } from '../../auth/entities/RefreshTokens.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string | null;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING_VERIFICATION,
  })
  status: UserStatus;

  @Column({ nullable: true, select: false })
  passwordHash?: string | null;

  // Tokens relationship
  @OneToMany(() => UserToken, token => token.user)
  tokens: UserToken[];

  @OneToMany(() => RefreshToken, token => token.user)
  refreshTokens: RefreshToken[];

  // OAuth fields
  @Column({ nullable: true })
  provider?: string;

  @Column({ name: 'provider_id', nullable: true, unique: true })
  providerId?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
