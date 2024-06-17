import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/di/types";
import { AuthenticationError, ValidationError } from "../../utils/ErrorHandler";
import bcrypt from "bcryptjs";
import { IAuthService } from "../interfaces/IAuthService";
import { UserModel } from "../../domain/models/UserModel";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { instanceToPlain } from "class-transformer";
import { validateModel } from "../../utils/ValidateModel";

/**
 * AuthService class handling user registration and login
 */
@injectable()
class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  /**
   * Registers a new user
   * @param email - User's email address
   * @param password - User's password
   * @returns The created user
   * @throws ValidationError if the user already exists
   */
  public async register(email: string, password: string): Promise<Partial<UserModel>> {
    const existingUser = await this.userRepository.findOne({ email });
    if (existingUser) {
      throw new ValidationError("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel(email, hashedPassword);
    await validateModel(user);
    await this.userRepository.create(user);
    return instanceToPlain(user) as Partial<UserModel>;
  }

  /**
   * Logs in a user
   * @param email - User's email address
   * @param password - User's password
   * @returns The authenticated user
   * @throws AuthenticationError if the credentials are invalid
   */
  public async login(email: string, password: string): Promise<Partial<UserModel>> {
    const userDoc = await this.userRepository.findOne({ email });
    if (!userDoc || !(await bcrypt.compare(password, userDoc.password!))) {
      throw new AuthenticationError("Invalid credentials");
    }
    const user = new UserModel(userDoc.email, userDoc.password, userDoc.outlookToken);
    return instanceToPlain(user) as Partial<UserModel>;
  }
}

export default AuthService;
