import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { UserStatus } from '../enums/userStatus.enum';
import { UserToken } from '../../auth/entities/confirmationToken.entity';
import { RefreshToken } from '../../auth/entities/refreshTokens.entity';
import { Role } from '../../auth/entities/roles.entity';

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

  @ManyToMany(() => Role, { eager: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @Column({ nullable: true, select: false })
  passwordHash?: string | null;

  // Tokens relationship
  @OneToMany(() => UserToken, token => token.user)
  confirmationTokens: UserToken[];

  @OneToMany(() => RefreshToken, token => token.user)
  refreshTokens: RefreshToken[];

  @Column('integer', { default: 0 })
  tokenVersion: number;

  // OAuth fields
  @Column({ nullable: true })
  provider?: string;

  @Column({ name: 'provider_id', nullable: true, unique: true })
  providerId?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', select: false })
  deletedAt?: Date;
}
