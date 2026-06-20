import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true })
  name!: string; // Ex: 'create:post', 'delete:user', 'read:analytics'

  @Column({ type: 'varchar', nullable: true })
  description?: string; // Ex: 'Allows a user to delete any user account'
}
