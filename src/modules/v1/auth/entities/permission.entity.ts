import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // Ex: 'create:post', 'delete:user', 'read:analytics'

  @Column({ nullable: true })
  description?: string; // Ex: 'Allows a user to delete any user account'
}
