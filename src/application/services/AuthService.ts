
import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/di/types";
import { AuthenticationError, ValidationError } from "../../utils/ErrorHandler";
import bcrypt from 'bcryptjs';
import { IAuthService } from "../interfaces/IAuthService";
import { UserModel } from "../../domain/models/UserModel";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";

@injectable()
class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  public async register(email: string, password: string): Promise<UserModel> {
    const existingUser = await this.userRepository.findOne({email});
    if (existingUser) {
      throw new ValidationError('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel(email, hashedPassword);
    await this.userRepository.create(user);
    return user;
  }

  public async login(email: string, password: string): Promise<UserModel> {
    const user = await this.userRepository.findOne({email});
    if (!user || !(await bcrypt.compare(password, user.password!))) {
      throw new AuthenticationError('Invalid credentials');
    }
    return user;
  }
}

export default AuthService;
