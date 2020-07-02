import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from './users.user';

@Entity({ name: 'users-passwords-authentications' })
export class PasswordAuthentication {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @OneToOne(
    () => User,
    user => user.passwordAuthentication
  )
  user: User;

  @Column()
  public password: string;
}
