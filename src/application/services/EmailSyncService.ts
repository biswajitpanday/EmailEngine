import { inject, injectable } from 'inversify';
import { TYPES } from '../../infrastructure/di/types';
import AxiosWrapper from '../../utils/AxiosWrapper';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import logger from '../../utils/Logger';
import { IEmailSyncRepository } from '../../domain/interfaces/IEmailSyncRepository';
import { EmailSyncModel } from '../../infrastructure/persistence/documents/EmailSyncModel';

@injectable()
export class EmailSyncService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.EmailSyncRepository)
    private emailSyncRepository: IEmailSyncRepository,
  ) {}

  public async syncEmails(): Promise<void> {
    try {
      const users = await this.userRepository.find({});

      for (const user of users) {
        if (user.outlookToken) {
          const emails = await this.fetchEmails(user.outlookToken);
          for (const email of emails) {
            await this.storeEmail(user.email, email);
          }
        }
      }

      logger.info('Email synchronization completed successfully.');
    } catch (error) {
      logger.error('Error during email synchronization:', error);
    }
  }

  private async fetchEmails(accessToken: string): Promise<any[]> {
    const axiosWrapper = new AxiosWrapper('https://graph.microsoft.com');
    try {
      const response = await axiosWrapper.get('/v1.0/me/messages', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data.value;
    } catch (error) {
      logger.error('Error fetching emails:', error);
      throw new Error('Failed to fetch emails');
    }
  }

  private async storeEmail(userEmail: string, email: any): Promise<void> {
    const emailDocument = new EmailSyncModel(
      userEmail,
      email.id,
      email.subject,
      email.bodyPreview,
      email.from.emailAddress.address,
      email.toRecipients.map(
        (recipient: any) => recipient.emailAddress.address,
      ),
      email.receivedDateTime,
    );
    try {
      await this.emailSyncRepository.create(emailDocument);
      logger.info(`Email stored with ID: ${email.id}`);
    } catch (error) {
      logger.error(`Error storing email with ID: ${email.id}`, error);
    }
  }
}
