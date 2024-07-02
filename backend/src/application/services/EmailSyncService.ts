import { inject, injectable } from 'inversify';
import { IEmailSyncService } from '../interfaces/IEmailSyncService';
import crypto from 'crypto';
import logger from '../../utils/Logger';
import { TYPES } from '../../infrastructure/di/types';
import { IEmailSyncRepository } from '../../domain/interfaces/IEmailSyncRepository';
import NgrokService from '../../infrastructure/config/NgrokService';
import { GraphClient } from '../../infrastructure/config/GraphClient';
import { Socket } from '../../infrastructure/config/Socket';
import { EmailSyncModel } from '../../infrastructure/persistence/documents/EmailSyncModel';

@injectable()
export class EmailSyncService implements IEmailSyncService {
  constructor(
    @inject(TYPES.EmailSyncRepository)
    private emailSyncRepository: IEmailSyncRepository,
  ) {}

  public async synchronizeEmails(accessToken: string): Promise<void> {
    const client = GraphClient.getClient(accessToken);

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

  public async handleNotification(
    notification: any,
    accessToken: string,
  ): Promise<void> {
    try {
      const { resourceData, changeType } = notification;
      const emailId = resourceData.id;
      const client = GraphClient.getClient(accessToken);
      const io = Socket.getInstance();

      switch (changeType) {
        case 'created': {
          const newEmail = await client.api(`/me/messages/${emailId}`).get();
          await this.storeEmail(newEmail.from.emailAddress.address, [newEmail]);
          io.emit('emailCreated', newEmail); // Emit event for new email
          logger.info(`Stored new email ID: ${emailId}`);
          break;
        }

        case 'updated': {
          const updatedEmail = await client
            .api(`/me/messages/${emailId}`)
            .get();
          updatedEmail.isFlagged =
            updatedEmail.flag && updatedEmail.flag.flagStatus === 'flagged';
          updatedEmail.isMoved =
            updatedEmail.parentFolderId !== updatedEmail.originalFolderId; // Check if folders differ
          updatedEmail.isDeleted = updatedEmail.deletedDateTime !== null;
          updatedEmail.isNew =
            updatedEmail.createdDateTime === updatedEmail.receivedDateTime; // Check if newly created

          await this.storeEmail(emailId, [updatedEmail]);
          io.emit('emailUpdated', updatedEmail); // Emit event for updated email
          logger.info(
            `Updated email ID: ${emailId} with read status and flags`,
          );
          break;
        }

        case 'deleted': {
          const email = await this.emailSyncRepository.findByEmailId(emailId);
          if (email != null) {
            await this.emailSyncRepository.delete(email.id!);
            io.emit('emailDeleted', emailId); // Emit event for deleted email
            logger.info(`Deleted email ID: ${emailId}`);
          } else {
            logger.info(`Email not found with emailId: ${emailId}`);
          }
          break;
        }

        default:
          logger.warn(`Unhandled change type: ${changeType}`);
          break;
      }
    } catch (error) {
      logger.error('Error handling notification:', error);
    }
  }

  //#region Private Methods
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
          email.createdDateTime,
          email.parentFolderId,
          email.originalFolderId,
          email.isRead,
          email.isFlagged,
          email.isDeleted,
          email.isMoved,
          email.isNew,
        );
        await this.emailSyncRepository.createOrUpdate(emailDocument);
        logger.info(`Email stored with ID: ${email.id}`);
      });
    } catch (error: any) {
      logger.error(`Error storing email `, error.message);
    }
  }

  private async createSubscription(
    accessToken: string,
    userEmail: string,
  ): Promise<void> {
    const client = GraphClient.getClient(accessToken);
    const ngrokService = NgrokService.getInstance();
    const ngrokUrl = ngrokService.url;
    const subscription = {
      changeType: 'created,updated,deleted',
      notificationUrl: `${ngrokUrl}/api/email/listen?token=${encodeURIComponent(accessToken)}`,
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
  //#endregion
}
