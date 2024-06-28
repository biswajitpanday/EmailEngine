import { injectable } from 'inversify';
import { IEmailSyncService } from '../interfaces/IEmailSyncService';
import crypto from 'crypto';
import { Client } from '@microsoft/microsoft-graph-client';

@injectable()
export class EmailSyncService implements IEmailSyncService {
  public async synchronizeEmails(accessToken: string): Promise<void> {
    const client = Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      },
    });

    try {
      const response = await client.api('/me/messages').get();
      const emails = response.value;
      await this.createSubscription(accessToken);
      //await this.storeEmail('biswajit.panday@live.com', emails);
      return emails;
    } catch (error: any) {
      throw new Error(`Error synchronizing emails: ${error?.message}`);
    }
  }

  public async createSubscription(accessToken: string): Promise<void> {
    const client = Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      },
    });

    const mailbox = 'user@domain.com'; // Replace with the actual mailbox

    const subscription = {
      changeType: 'updated',
      notificationUrl: 'https://localhost:3000/listen',
      resource: `users/${mailbox}/messages`,
      expirationDateTime: new Date(
        Date.now() + 2 * 24 * 60 * 60 * 1000,
      ).toISOString(), // 2 days from now
      clientState: crypto.randomBytes(16).toString('hex'),
    };

    try {
      const response = await client.api('/subscriptions').post(subscription);
      console.log('Subscription created: ', response);
    } catch (error) {
      console.error('Error creating subscription: ', error);
    }
  }

  // private async storeEmail(userEmail: string, email: any): Promise<void> {
  //   const emailDocument = new EmailSyncModel(
  //     userEmail,
  //     email.id,
  //     email.subject,
  //     email.bodyPreview,
  //     email.from.emailAddress.address,
  //     email.toRecipients.map(
  //       (recipient: any) => recipient.emailAddress.address,
  //     ),
  //     email.receivedDateTime,
  //   );
  //   try {
  //     await this.emailSyncRepository.create(emailDocument);
  //     logger.info(`Email stored with ID: ${email.id}`);
  //   } catch (error) {
  //     logger.error(`Error storing email with ID: ${email.id}`, error);
  //   }
  // }
}
