import { Entity, PrimaryColumn, OneToMany, Column } from 'typeorm';

import { AccountCharacter } from './account-character';

@Entity({ name: 'access_accounts' })
export class Account {
  @PrimaryColumn('uuid')
  public id: string;

  @Column({ length: 320, unique: true })
  public email: string;

  @Column({ length: 320 })
  public passwordHash: string;

  @OneToMany(
    () => AccountCharacter,
    character => character.account,
    {
      cascade: true,
    }
  )
  characters: AccountCharacter[];

}
