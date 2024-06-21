import { UserModel } from '../../infrastructure/persistence/documents/UserModel';

export interface IAuthService {
  createOrUpdateUser(user: UserModel): Promise<any>;
  findUserByEmail(email: string): Promise<UserModel | null>;
}
