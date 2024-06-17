import { IsEmail, IsOptional } from "class-validator";
import { BaseModel } from "./BaseModel";

export class UserModel extends BaseModel {
  @IsEmail()
  public email: string;
  @IsOptional()
  public password?: string;
  @IsOptional()
  public outlookToken?: string;

  constructor(email: string, password?: string, outlookToken?: string) {
    super();
    this.email = email;
    this.password = password;
    this.outlookToken = outlookToken;
  }
}
