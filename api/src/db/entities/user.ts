import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn({ length: 320, unique: true })
  public id: string;

  @Column({ length: 320, unique: true })
  public email: string;

  @Column()
  public passwordHash: string;
}
