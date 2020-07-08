import { Entity, PrimaryColumn, ManyToOne } from 'typeorm';

import { Account } from './account';

@Entity({ name: 'access_accounts_characters' })
export class AccountCharacter {
  @PrimaryColumn('uuid')
  public id: string;

  @ManyToOne(
    () => Account,
    account => account.characters
  )
  account: Account;
}
