import { inject, injectable } from 'inversify';
import { IAuthService } from '../interfaces/IAuthService';
import { AccessToken, OnBehalfOfCredential } from '@azure/identity';
import AppConst from '../../utils/Constants';
import { TYPES } from '../../infrastructure/di/types';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { UserModel } from '../../infrastructure/persistence/documents/UserModel';
import logger from '../../utils/Logger';
import { Client } from '@microsoft/microsoft-graph-client';

@injectable()
class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
  ) {}
  public async getOnBehalfToken(idToken: string): Promise<AccessToken> {
    try {
      const oboCredential = new OnBehalfOfCredential({
        tenantId: 'common',
        clientId: AppConst.OutlookClientId,
        clientSecret: AppConst.OutlookClientSecret,
        userAssertionToken: idToken,
      });
      const accessToken = await oboCredential.getToken([
        'https://graph.microsoft.com/.default',
      ]);
      await this.storeUser(accessToken.token);
      return accessToken;
    } catch (error: any) {
      throw error?.message;
    }
  }

  private async storeUser(accessToken: string): Promise<void> {
    const client = Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      },
    });
    try {
      const user = await client.api('/me').get();
      const email = user.mail || user.userPrincipalName;
      const existingUser = await this.userRepository.findByEmail(email);
      const userModel = new UserModel(email, accessToken, accessToken); // Todo: Last param should be Refresh Token.
      if (existingUser != null) {
        this.userRepository.update(existingUser.id!, userModel);
      } else {
        this.userRepository.create(userModel);
      }
      logger.info(`User stored with Email: ${email}`);
    } catch (error: any) {
      logger.error(`Error storing user: ${error}`);
    }
  }
}

export default AuthService;
