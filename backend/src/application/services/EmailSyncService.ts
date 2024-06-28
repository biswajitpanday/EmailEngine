import { inject, injectable } from 'inversify';
import { IEmailSyncService } from '../interfaces/IEmailSyncService';
import crypto from 'crypto';
import { Client } from '@microsoft/microsoft-graph-client';
import { EmailSyncModel } from '../../infrastructure/persistence/documents/EmailSyncModel';
import logger from '../../utils/Logger';
import { TYPES } from '../../infrastructure/di/types';
import { IEmailSyncRepository } from '../../domain/interfaces/IEmailSyncRepository';
import NgrokService from '../../infrastructure/config/NgrokService';

@injectable()
export class EmailSyncService implements IEmailSyncService {
  constructor(
    @inject(TYPES.EmailSyncRepository)
    private emailSyncRepository: IEmailSyncRepository,
  ) {}

  public async synchronizeEmails(accessToken: string): Promise<void> {
    const client = Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      },
    });

    try {
      const response = await client.api('/me/messages').get();
      const emails = response.value;
      const user = await client.api('/me').get();
      const userEmail = user.mail || user.userPrincipalName;
      await this.storeEmail(userEmail, emails);
      await this.createSubscription(accessToken, userEmail);
      return emails;
    } catch (error: any) {
      throw new Error(`Error synchronizing emails: ${error?.message}`);
    }
  }

  public async createSubscription(
    accessToken: string,
    userEmail: string,
  ): Promise<void> {
    const client = Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      },
    });

    const ngrokService = NgrokService.getInstance();
    const ngrokUrl = ngrokService.url;
    const subscription = {
      changeType: 'updated',
      notificationUrl: `${ngrokUrl}/api/email/listen`,
      resource: `users/${userEmail}/messages`,
      expirationDateTime: new Date(
        Date.now() + 2 * 24 * 60 * 60 * 1000,
      ).toISOString(), // 2 days from now
      clientState: crypto.randomBytes(16).toString('hex'),
    };

    try {
      const response = await client.api('/subscriptions').post(subscription);
      logger.info('Subscription created: ', response);
    } catch (error) {
      logger.error('Error creating subscription: ', error);
    }
  }

  private async storeEmail(userEmail: string, emails: any[]): Promise<void> {
    try {
      emails.forEach(async (email: any) => {
        const emailId = email.id;
        const emailDocument = new EmailSyncModel(
          userEmail,
          emailId,
          email.subject,
          email.bodyPreview,
          email.from.emailAddress.address,
          email.toRecipients.map(
            (recipient: any) => recipient.emailAddress.address,
          ),
          email.receivedDateTime,
        );
        const body = {
          match: { emailId },
        };
        const existingEmail = await this.emailSyncRepository.findOne(body);
        if (!existingEmail) {
          await this.emailSyncRepository.create(emailDocument);
        }
        logger.info(`Email stored with ID: ${email.id}`);
      });
    } catch (error: any) {
      logger.error(`Error storing email `, error.message);
    }
  }
}
