export interface IEmailSyncService {
  synchronizeEmails(
    accessToken: string,
    skipToken: string,
  ): Promise<{ emails: any[]; nextLink: string | null }>;
  synchronizeEmailsByFolder(
    accessToken: string,
  ): Promise<{ [folderName: string]: any[] }>;
  handleNotification(resourceData: any, token: string): Promise<void>;
}