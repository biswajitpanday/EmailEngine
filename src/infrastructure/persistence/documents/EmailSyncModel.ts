import { IsEmail, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import { ElasticSearchDocument } from './ElasticSearchDocument';

/**
 * EmailSync model class with validation
 */
export class EmailSyncModel extends ElasticSearchDocument {
  @IsNotEmpty({ message: 'User email is required' })
  @IsEmail({}, { message: 'Invalid user email address' })
  @Expose()
  public userEmail: string;

  @IsNotEmpty({ message: 'Email ID is required' })
  @Expose()
  public emailId: string;

  @IsNotEmpty({ message: 'Email subject is required' })
  @Expose()
  public subject: string;

  @IsNotEmpty({ message: 'Email body is required' })
  @Expose()
  public body: string;

  @IsNotEmpty({ message: 'Sender email is required' })
  @IsEmail({}, { message: 'Invalid sender email address' })
  @Expose()
  public from: string;

  @IsNotEmpty({ message: 'Recipient emails are required' })
  @Expose()
  public to: string[];

  @IsNotEmpty({ message: 'Received date and time is required' })
  @Expose()
  public receivedDateTime: string;

  /**
   * EmailSync model constructor
   * @param userEmail - User's email address
   * @param emailId - Email ID
   * @param subject - Email subject
   * @param body - Email body
   * @param from - Sender email address
   * @param to - Recipient email addresses
   * @param receivedDateTime - Received date and time
   */
  constructor(
    userEmail: string,
    emailId: string,
    subject: string,
    body: string,
    from: string,
    to: string[],
    receivedDateTime: string,
  ) {
    super();
    this.userEmail = userEmail;
    this.emailId = emailId;
    this.subject = subject;
    this.body = body;
    this.from = from;
    this.to = to;
    this.receivedDateTime = receivedDateTime;
  }
}
