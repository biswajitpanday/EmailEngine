import { inject, injectable } from 'inversify';
import { TYPES } from '../../infrastructure/di/types';
import { IAuthService } from '../interfaces/IAuthService';
import bcrypt from 'bcryptjs';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { instanceToPlain } from 'class-transformer';
import logger from '../../utils/Logger';
import { AuthenticationError, ValidationError } from '../../utils/ErrorHandler';
import { validateModel } from '../../utils/ValidateModel';
import { UserModel } from '../../infrastructure/persistence/documents/UserModel';

@injectable()
class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository,
  ) {}

  /**
   * Registers a new user
   * @param email - User's email address
   * @param password - User's password
   * @returns The created user
   * @throws ValidationError if the user already exists
   */
  public async register(
    email: string,
    password: string,
  ): Promise<Partial<UserModel>> {
    try {
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser && existingUser?.email) {
        throw new ValidationError('User already exists');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new UserModel(email, hashedPassword);
      await validateModel(user);
      await this.userRepository.create(user);
      logger.info(`User registered with email: ${email}`);
      return instanceToPlain(user) as Partial<UserModel>;
    } catch (error) {
      logger.error('Error during user registration:', error);
      throw error;
    }
  }

  /**
   * Logs in a user
   * @param email - User's email address
   * @param password - User's password
   * @returns The authenticated user
   * @throws AuthenticationError if the credentials are invalid
   */
  public async login(
    email: string,
    password: string,
  ): Promise<Partial<UserModel>> {
    try {
      const userDoc = await this.userRepository.findByEmail(email);
      if (!userDoc || !(await bcrypt.compare(password, userDoc.password!))) {
        throw new AuthenticationError('Invalid credentials');
      }
      const user = new UserModel(
        userDoc.email,
        userDoc.password,
        userDoc.outlookToken,
      );
      logger.info(`User logged in with email: ${email}`);
      return instanceToPlain(user) as Partial<UserModel>;
    } catch (error) {
      logger.error('Error during user login:', error);
      throw error;
    }
  }
}

export default AuthService;
