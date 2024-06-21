import axios from 'axios';
import { injectable } from 'inversify';
import { IEmailSyncService } from '../../interfaces/IEmailSyncService';

@injectable()
export class OutlookService implements IEmailSyncService {
  private outlookApiUrl = 'https://graph.microsoft.com/v1.0/me/messages';

  public async getEmails(accessToken: string): Promise<any[]> {
    const response = await axios.get(this.outlookApiUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data.value;
  }
}
