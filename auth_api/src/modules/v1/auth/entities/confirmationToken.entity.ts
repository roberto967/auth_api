import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { UserTokenType } from '../enum/userTokenTypes.enum';

@Entity('user_tokens')
export class UserToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  tokenHash!: string; // Token will be hashed before storage

  @Column({ name: 'expires_at' })
  expiresAt!: Date;

  @Column({
    type: 'enum',
    enum: UserTokenType,
  })
  type!: UserTokenType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => User, user => user.confirmationTokens)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  public isExpired(): boolean {
    return Date.now() >= this.expiresAt.getTime();
  }
}
