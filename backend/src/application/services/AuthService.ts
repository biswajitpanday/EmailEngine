import { injectable } from 'inversify';
import { IAuthService } from '../interfaces/IAuthService';
import { OnBehalfOfCredential } from '@azure/identity';
import AppConst from '../../utils/Constants';

@injectable()
class AuthService implements IAuthService {
  public async getOnBehalfToken(idToken: string): Promise<string> {
    try {
      const oboCredential = new OnBehalfOfCredential({
        tenantId: 'common',
        clientId: AppConst.OutlookClientId,
        clientSecret: AppConst.OutlookClientSecret,
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
