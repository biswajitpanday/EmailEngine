export interface IEmailSyncService {
  synchronizeEmails(
    accessToken: string,
    skipToken: string,
  ): Promise<{ emails: any[]; nextLink: string | null }>;
  handleNotification(resourceData: any, token: string): Promise<void>;
}
