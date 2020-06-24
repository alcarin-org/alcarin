import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { User } from './user';

@Entity({ name: 'characters' })
export class Character {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ length: 320, unique: true })
  public name: string;

  @Column()
  public race: string;

  @ManyToOne(
    () => User,
    user => user.characters
  )
  owner: User;
}
