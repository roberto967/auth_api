import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserStatus } from '../enums/userStatus.enum';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: UserStatus.PENDING_VERIFICATION,
  })
  status: UserStatus;

  @Column({ nullable: true, select: false })
  passwordHash: string;

  // OAuth fields
  @Column({ nullable: true })
  provider?: string;

  @Column({ name: 'provider_id', nullable: true, unique: true })
  providerId?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
