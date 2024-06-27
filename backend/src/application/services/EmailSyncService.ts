import { injectable } from 'inversify';
import AxiosWrapper from '../../utils/AxiosWrapper';
import { IEmailSyncService } from '../interfaces/IEmailSyncService';

@injectable()
export class EmailSyncService implements IEmailSyncService {
  constructor() {}

  public async synchronizeEmails(accessToken: string): Promise<void> {
    const axiosWrapper = new AxiosWrapper('https://graph.microsoft.com/');
    try {
      const response = await axiosWrapper.get(
        'v1.0/me/mailFolders/Inbox/messages',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const emails = response.data.value;
      //await this.storeEmail('biswajit.panday@live.com', emails);
      return emails;
    } catch (error: any) {
      throw new Error(`Error synchronizing emails: ${error?.message}`);
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
