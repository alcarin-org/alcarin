import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

import { Character } from './characters.character';

@Entity({ name: 'characters-personal-information' })
export class PersonalInformation {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ length: 320 })
  public name: string;

  @Column()
  public age: number;

  @OneToOne(
    () => Character,
    character => character.personalInfo
  )
  character: Character;
}
