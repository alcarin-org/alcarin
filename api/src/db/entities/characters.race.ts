import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

import { Character } from './characters.character';

@Entity({ name: 'characters-race' })
export class Race {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ length: 320 })
  public raceKey: string;

  @OneToOne(
    () => Character,
    character => character.race
  )
  character: Character;
}
