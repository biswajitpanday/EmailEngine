import { UserModel } from "../../domain/models/UserModel";

/**
 * Interface representing the authentication service
 */
export interface IAuthService {
  /**
   * Registers a new user
   * @param email - User's email address
   * @param password - User's password
   * @returns A promise that resolves to the created user
   */
  register(email: string, password: string): Promise<Partial<UserModel>>;

  /**
   * Logs in a user
   * @param email - User's email address
   * @param password - User's password
   * @returns A promise that resolves to the authenticated user
   */
  login(email: string, password: string): Promise<Partial<UserModel>>;
}
