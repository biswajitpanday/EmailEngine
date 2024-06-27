import { injectable } from 'inversify';
import { IAuthService } from '../interfaces/IAuthService';
import { OnBehalfOfCredential } from '@azure/identity';

@injectable()
class AuthService implements IAuthService {
  public async getOnBehalfToken(idToken: string): Promise<string> {
    const tenantId = 'common';
    const clientId = process.env.OUTLOOK_CLIENT_ID || '';
    const clientSecret = process.env.OUTLOOK_CLIENT_SECRET || '';

    try {
      const oboCredential = new OnBehalfOfCredential({
        tenantId,
        clientId,
        clientSecret,
        userAssertionToken: idToken,
      });
      const tokenResponse = await oboCredential.getToken([
        'https://graph.microsoft.com/.default',
      ]);

      return tokenResponse.token;
    } catch (error: any) {
      throw error?.message;
    }
  }
}

export default AuthService;
