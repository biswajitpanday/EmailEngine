import { UserModel } from "../../domain/models/UserModel";

export interface IAuthService {
  register(email: string, password: string): Promise<UserModel>;
  login(email: string, password: string): Promise<UserModel>;
}
