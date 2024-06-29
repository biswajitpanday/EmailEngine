export interface IEmailSyncService {
  synchronizeEmails(accessToken: string): any;
  handleNotification(resourceData: any): Promise<void>;
}
