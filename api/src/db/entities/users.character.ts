import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { User } from './users.user';

@Entity({ name: 'users-characters' })
export class Character {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(
    () => User,
    user => user.characters
  )
  user: User;
}
