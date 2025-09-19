import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from './permission.entity';
import { UserRole } from '../enum/userRole.enum';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'enum', enum: UserRole })
  name: UserRole; // Ex: 'admin', 'moderator', 'user'

  @ManyToMany(() => Permission, { cascade: true, eager: true })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: Permission[];
}
