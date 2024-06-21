export interface IEmailSyncService {
  getEmails(accessToken: string): Promise<any[]>;
}
