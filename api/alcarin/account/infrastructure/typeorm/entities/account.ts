import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'accounts' })
export class Account {
  @PrimaryColumn()
  public id: string;

  @Column({ length: 320, unique: true })
  public email: string;

  @Column()
  public passwordHash: string;

  @Column()
  public isAdmin: boolean;
}
