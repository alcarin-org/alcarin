import { User } from './user.aggregate';

export interface UserRepository {
  save(user: User): Promise<void>;
  getById(id: string): Promise<User>;
  getByEmail(email: string): Promise<User>;
}
