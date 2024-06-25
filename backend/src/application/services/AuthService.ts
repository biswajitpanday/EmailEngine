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
import AxiosWrapper from '../../utils/AxiosWrapper';

@injectable()
class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository,
  ) {}
  // Example code to test registration
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

  // Example code to test login
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

  // Example code to test axios wrapper.
  public async fetchEmails(accessToken: string): Promise<any[]> {
    const axiosWrapper = new AxiosWrapper('https://graph.microsoft.com');
    try {
      const response = await axiosWrapper.get('/v1.0/me/messages', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data.value;
    } catch (error) {
      logger.error('Error fetching emails:', error);
      throw new Error('Failed to fetch emails');
    }
  }
}

export default AuthService;
