import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ length: 320, unique: true })
  public email: string;

  @Column()
  public passwordHash: string;
}
