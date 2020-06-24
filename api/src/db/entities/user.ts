import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { Character } from './character';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ length: 320, unique: true })
  public email: string;

  @Column()
  public passwordHash: string;

  @OneToMany(
    () => Character,
    character => character.owner
  )
  characters: Character[];
}
