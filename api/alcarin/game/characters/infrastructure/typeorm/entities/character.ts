import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'characters' })
export class Character {
  @PrimaryColumn()
  public id: string;

  @Column()
  public name: string;

  @Column()
  public bornAt: number;

  @Column()
  public raceKey: string;

  @Column()
  public ownerId: string;
}
