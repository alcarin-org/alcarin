import { Entity, PrimaryColumn, OneToOne } from 'typeorm';

import { PersonalInformation } from './characters.personal-information';
import { Race } from './characters.race';

@Entity({ name: 'characters-user' })
export class Character {
  @PrimaryColumn()
  public id: string;

  @OneToOne(
    () => Race,
    race => race.character,
    {
      cascade: true,
    }
  )
  race: Race;

  @OneToOne(
    () => PersonalInformation,
    personalInfo => personalInfo.character,
    {
      cascade: true,
    }
  )
  personalInfo: PersonalInformation;
}
