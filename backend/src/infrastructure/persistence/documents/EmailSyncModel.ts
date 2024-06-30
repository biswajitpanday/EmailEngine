import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';
import { ElasticSearchDocument } from './ElasticSearchDocument';

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

  @IsNotEmpty({ message: 'Created date and time is required' })
  @Expose()
  public createdDateTime: string;

  @IsOptional()
  @Expose()
  public parentFolderId: string;

  @IsOptional()
  @Expose()
  public originalFolderId: string;

  @IsOptional()
  @Expose()
  public isRead?: boolean;

  @IsOptional()
  @Expose()
  public isFlagged?: boolean;

  @IsOptional()
  @Expose()
  public isDeleted?: boolean;

  @IsOptional()
  @Expose()
  public isMoved?: boolean;

  @IsOptional()
  @Expose()
  public isNew?: boolean;
  /**
   * EmailSync model constructor
   * @param userEmail - User's email address
   * @param emailId - Email ID
   * @param subject - Email subject
   * @param body - Email body
   * @param from - Sender email address
   * @param to - Recipient email addresses
   * @param receivedDateTime - Received date and time
   * @param createdDateTime - Created date and time
   * @param parentFolderId - Parent Folder Id
   * @param originalFolderId - Original Folder Id
   * @param isRead - Email Is Read
   * @param isFlagged - Email Is Flagged
   * @param isDeleted - Email Is Deleted
   * @param isMoved - Email Is Moved
   * @param isNew - Email Is New
   */
  constructor(
    userEmail: string,
    emailId: string,
    subject: string,
    body: string,
    from: string,
    to: string[],
    receivedDateTime: string,
    createdDateTime: string,
    parentFolderId: string,
    originalFolderId: string,
    isRead?: boolean,
    isFlagged?: boolean,
    isDeleted?: boolean,
    isMoved?: boolean,
    isNew?: boolean,
  ) {
    super();
    this.userEmail = userEmail;
    this.emailId = emailId;
    this.subject = subject;
    this.body = body;
    this.from = from;
    this.to = to;
    this.receivedDateTime = receivedDateTime;
    this.createdDateTime = createdDateTime;
    this.parentFolderId = parentFolderId;
    this.originalFolderId = originalFolderId;
    this.isRead = isRead;
    this.isFlagged = isFlagged;
    this.isDeleted = isDeleted;
    this.isMoved = isMoved;
    this.isNew = isNew;
  }
}
