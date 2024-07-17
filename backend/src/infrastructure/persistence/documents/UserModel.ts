import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';
import { ElasticSearchDocument } from './ElasticSearchDocument';

/**
 * User model class with validation
 */
export class UserModel extends ElasticSearchDocument {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  @Expose()
  public email: string;

  @IsOptional()
  @Expose()
  public authToken?: string;

  @IsOptional()
  @Expose()
  public refreshToken?: string;

  /**
   * User model constructor
   * @param email - User's email address
   * @param authToken - User's Provider's auth token (optional)
   * @param refreshToken - User's refresh token (optional)
   */
  constructor(email: string, authToken?: string, refreshToken?: string) {
    super();
    this.email = email;
    this.outlookToken = authToken;
    this.refreshToken = refreshToken;
  }
}
