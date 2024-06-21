import { inject, injectable } from 'inversify';
import { TYPES } from '../../infrastructure/di/types';
import { IAuthService } from '../interfaces/IAuthService';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { UserModel } from '../../infrastructure/persistence/documents/UserModel';

@injectable()
class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository,
  ) {}

  public async createOrUpdateUser(user: UserModel): Promise<UserModel> {
    const existingUser = await this.userRepository.findByEmail(user.email);
    if (existingUser) {
      existingUser.outlookToken = user.outlookToken;
      existingUser.refreshToken = user.refreshToken;
      await this.userRepository.update(existingUser.id!, existingUser);
      return existingUser;
    } else {
      return await this.userRepository.create(user);
    }
  }

  public async findUserByEmail(email: string): Promise<UserModel | null> {
    return await this.userRepository.findByEmail(email);
  }
}

export default AuthService;
