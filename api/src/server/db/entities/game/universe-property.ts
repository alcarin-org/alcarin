import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'game_universe_properties' })
export class UniverseProperty {
  @PrimaryColumn({ length: 64 })
  public key: string;

  @Column()
  public value: string;
}
