import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { BaseModel } from './BaseModel';
import { Exclude, Expose } from 'class-transformer';

/**
 * User model class with validation
 */
export class UserModel extends BaseModel {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  @Expose()
  public email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @Length(4, 100, { message: 'Password must be at least 4 characters long' })
  @Exclude({ toPlainOnly: true })
  public password: string;

  @IsOptional()
  @Expose()
  public outlookToken?: string;

  /**
   * User model constructor
   * @param email - User's email address
   * @param password - User's password (optional)
   * @param outlookToken - User's Outlook token (optional)
   */
  constructor(email: string, password: string, outlookToken?: string) {
    super();
    this.email = email;
    this.password = password;
    this.outlookToken = outlookToken;
  }
}
