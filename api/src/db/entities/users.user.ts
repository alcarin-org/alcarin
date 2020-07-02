import { Entity, PrimaryColumn, OneToMany, OneToOne } from 'typeorm';

import { Character } from './users.character';
import { PasswordAuthentication } from './users.password-authentication';
import { UserData } from './users.user-data';

@Entity({ name: 'users-user' })
export class User {
  @PrimaryColumn()
  public id: string;

  @OneToMany(
    () => Character,
    character => character.user,
    {
      cascade: true,
    }
  )
  characters: Character[];

  @OneToOne(
    () => PasswordAuthentication,
    passwordAuthentication => passwordAuthentication.user,
    {
      cascade: true,
    }
  )
  passwordAuthentication: PasswordAuthentication;

  @OneToOne(
    () => UserData,
    userData => userData.user,
    {
      cascade: true,
    }
  )
  userData: UserData;
}
