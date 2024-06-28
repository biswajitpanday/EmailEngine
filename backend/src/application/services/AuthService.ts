import { inject, injectable } from 'inversify';
import { IAuthService } from '../interfaces/IAuthService';
import { OnBehalfOfCredential } from '@azure/identity';
import AppConst from '../../utils/Constants';
import { TYPES } from '../../infrastructure/di/types';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { Client } from '@microsoft/microsoft-graph-client';
import { UserModel } from '../../infrastructure/persistence/documents/UserModel';
import logger from '../../utils/Logger';

@injectable()
class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
  ) {}
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
      this.StoreUser(tokenResponse.token);
      return tokenResponse.token;
    } catch (error: any) {
      throw error?.message;
    }
  }

  private async StoreUser(token: string): Promise<void> {
    const client = Client.init({
      authProvider: (done) => {
        done(null, token);
      },
    });
    try {
      const user = await client.api('/me').get();
      const email = user.mail || user.userPrincipalName;
      const existingUser = await this.userRepository.findByEmail(email);
      const userModel = new UserModel(email, undefined, token);
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
