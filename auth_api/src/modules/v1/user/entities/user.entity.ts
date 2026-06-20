import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { UserStatus } from '../enums/userStatus.enum';
import { UserToken } from '../../auth/entities/confirmationToken.entity';
import { RefreshToken } from '../../auth/entities/refreshTokens.entity';
import { Role } from '../../auth/entities/roles.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  name: string | null;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING_VERIFICATION,
  })
  status: UserStatus;

  @ManyToOne(() => Role, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ type: 'varchar', nullable: true })
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

  @Column({
    type: 'varchar',
    name: 'provider_id',
    nullable: true,
    unique: true,
  })
  providerId?: string | null;

  // Timestamps - TypeORM will handle these automatically
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', select: false })
  deletedAt?: Date;
}
