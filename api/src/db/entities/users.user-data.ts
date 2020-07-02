import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

import { User } from './users.user';

@Entity({ name: 'users-user-data' })
export class UserData {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ length: 320, unique: true })
  public email: string;

  @OneToOne(
    () => User,
    user => user.userData
  )
  user: User;
}
