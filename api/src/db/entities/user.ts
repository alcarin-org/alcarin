import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  // TODO: migrate to uuid or something, as email CAN change potentially
  @PrimaryColumn({ length: 320 })
  public email: string;

  @Column()
  public passwordHash: string;
}
