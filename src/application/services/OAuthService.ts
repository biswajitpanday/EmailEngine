import { injectable } from 'inversify';
import { AuthorizationCode } from 'simple-oauth2';
import logger from '../../utils/Logger';

@injectable()
export class OAuthService {
  private client: AuthorizationCode;

  constructor() {
    this.client = new AuthorizationCode({
      client: {
        id: process.env.OUTLOOK_CLIENT_ID!,
        secret: process.env.OUTLOOK_CLIENT_SECRET!,
      },
      auth: {
        tokenHost: 'https://login.microsoftonline.com',
        authorizePath: 'common/oauth2/v2.0/authorize',
        tokenPath: 'common/oauth2/v2.0/token',
      },
    });
  }

  public getAuthorizationUrl(redirectUri: string): string {
    const authorizationUri = this.client.authorizeURL({
      redirect_uri: redirectUri,
      scope: [
        'openid',
        'profile',
        'email',
        'offline_access',
        'https://outlook.office.com/Mail.Read',
      ],
    });
    return authorizationUri;
  }

  public async getTokenFromCode(code: string, redirectUri: string) {
    const tokenParams = {
      code,
      redirect_uri: redirectUri,
      scope: [
        'openid',
        'profile',
        'email',
        'offline_access',
        'https://outlook.office.com/Mail.Read',
      ],
    };

    try {
      const accessToken = await this.client.getToken(tokenParams);
      return accessToken.token;
    } catch (error: any) {
      logger.error('Access Token Error', error.message);
      throw error;
    }
  }
}
