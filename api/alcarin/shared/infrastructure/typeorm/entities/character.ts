import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';

import { Account } from './account';

@Entity({ name: 'game_characters' })
export class Character {
  @PrimaryColumn('uuid')
  public id: string;

  @Column({ length: 320 })
  public raceKey: string;

  @Column()
  public age: number;

  @Column({ length: 320 })
  public name: string;

  @ManyToOne(
    () => Account,
    account => account.characters
  )
  account: Account;
}
