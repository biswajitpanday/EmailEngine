import { inject, injectable } from 'inversify';
import { TYPES } from '../../infrastructure/di/types';
import { IEmailRepository } from '../../domain/interfaces/IEmailRepository';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { EmailModel } from '../../infrastructure/persistence/documents/EmailModel';
import { UserModel } from '../../infrastructure/persistence/documents/UserModel';
import { OutlookService } from './adapters/OutlookService';

@injectable()
export class EmailSyncService {
  constructor(
    @inject(TYPES.EmailRepository) private emailRepository: IEmailRepository,
    @inject(TYPES.OutlookService) private outlookService: OutlookService,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    // For future Gmail support
    // @inject(TYPES.GmailService) private gmailService: IEmailService,
  ) {}

  public async syncUserEmails(userId: string): Promise<void> {
    const user: UserModel | null = await this.userRepository.getById(userId);
    if (!user || !user.outlookToken) {
      throw new Error('User not found or missing Outlook token');
    }

    const emails = await this.outlookService.getEmails(user.outlookToken);
    for (const email of emails) {
      const emailModel = new EmailModel(
        email.subject,
        email.from.emailAddress.address,
        email.toRecipients.map(
          (recipient: any) => recipient.emailAddress.address,
        ),
        email.receivedDateTime,
        email.body?.content,
      );
      emailModel.userId = userId;
      await this.emailRepository.create(emailModel);
    }
  }
}
