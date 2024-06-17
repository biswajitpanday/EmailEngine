import { UserModel } from "../models/UserModel";
import { IRepositoryBase } from "./IRepositoryBase";

export interface IUserRepository extends IRepositoryBase<UserModel> {
  
}
