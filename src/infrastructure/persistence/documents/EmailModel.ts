import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';
import { ElasticSearchDocument } from './ElasticSearchDocument';

/**
 * Email model class with validation
 */
export class EmailModel extends ElasticSearchDocument {
  @IsNotEmpty()
  @IsString()
  @Expose()
  public subject: string;

  @IsNotEmpty()
  @IsEmail()
  @Expose()
  public from: string;

  @IsNotEmpty()
  @IsEmail({}, { each: true })
  @Expose()
  public to: string[];

  @IsOptional()
  @IsString()
  @Expose()
  public body?: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  public receivedAt: string;

  /**
   * Email model constructor
   * @param subject - Subject of the email
   * @param from - Sender's email address
   * @param to - Recipient email addresses
   * @param body - Body content of the email
   * @param receivedAt - Received timestamp of the email
   */
  constructor(
    subject: string,
    from: string,
    to: string[],
    receivedAt: string,
    body?: string,
  ) {
    super();
    this.subject = subject;
    this.from = from;
    this.to = to;
    this.body = body;
    this.receivedAt = receivedAt;
  }
}
