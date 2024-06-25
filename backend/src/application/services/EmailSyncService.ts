import { inject, injectable } from 'inversify';
import { TYPES } from '../../infrastructure/di/types';
import AxiosWrapper from '../../utils/AxiosWrapper';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import logger from '../../utils/Logger';
import { IEmailSyncRepository } from '../../domain/interfaces/IEmailSyncRepository';
import { EmailSyncModel } from '../../infrastructure/persistence/documents/EmailSyncModel';
import jwt from 'jsonwebtoken';

@injectable()
export class EmailSyncService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.EmailSyncRepository)
    private emailSyncRepository: IEmailSyncRepository,
  ) {}

  public async syncEmails(): Promise<void> {
    try {
      const users = await this.userRepository.find({});

      for (const user of users) {
        if (user.outlookToken && user.refreshToken) {
          try {
            const emails = await this.fetchEmails(user.outlookToken);
            for (const email of emails) {
              await this.storeEmail(user.email, email);
            }
          } catch (error) {
            // If the token is invalid, refresh it
            if (this.isTokenExpired(error)) {
              const newAccessToken = await this.refreshAccessToken(
                user.refreshToken,
              );
              if (newAccessToken) {
                user.outlookToken = newAccessToken;
                await this.userRepository.update(user.id!, user); // TODO: Introduce UserId (Start Code From Here.... )
                const emails = await this.fetchEmails(newAccessToken);
                for (const email of emails) {
                  await this.storeEmail(user.email, email);
                }
              }
            } else {
              throw error;
            }
          }
        }
      }

      logger.info('Email synchronization completed successfully.');
    } catch (error) {
      logger.error('Error during email synchronization:', error);
    }
  }

  private async fetchEmails(accessToken: string): Promise<any[]> {
    const axiosWrapper = new AxiosWrapper('https://graph.microsoft.com');

    // if (!accessToken.includes('.')) {
    //   logger.error('Access token is not a well-formed JWT');
    //   throw new Error('Invalid access token format');
    // }

    try {
      jwt.decode(accessToken);
      const response = await axiosWrapper.get('/v1.0/me/messages', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data.value;
    } catch (error) {
      logger.error('Error fetching emails:', error);
      throw error;
    }
  }

  private async storeEmail(userEmail: string, email: any): Promise<void> {
    const emailDocument = new EmailSyncModel(
      userEmail,
      email.id,
      email.subject,
      email.bodyPreview,
      email.from.emailAddress.address,
      email.toRecipients.map(
        (recipient: any) => recipient.emailAddress.address,
      ),
      email.receivedDateTime,
    );
    try {
      await this.emailSyncRepository.create(emailDocument);
      logger.info(`Email stored with ID: ${email.id}`);
    } catch (error) {
      logger.error(`Error storing email with ID: ${email.id}`, error);
    }
  }

  private async refreshAccessToken(
    refreshToken: string,
  ): Promise<string | null> {
    const axiosWrapper = new AxiosWrapper('https://login.microsoftonline.com');
    try {
      const response = await axiosWrapper.post(
        '/common/oauth2/v2.0/token',
        null,
        {
          params: {
            grant_type: 'refresh_token', // authorization_code
            refresh_token: refreshToken,
            client_id: process.env.OUTLOOK_CLIENT_ID,
            client_secret: process.env.OUTLOOK_CLIENT_SECRET,
            scope: 'https://graph.microsoft.com/.default',
          },
        },
      );
      return response.data.access_token;
    } catch (error) {
      logger.error('Error refreshing access token:', error);
      return null;
    }
  }

  private isTokenExpired(error: any): boolean {
    // Check if the error indicates an expired token (this may vary based on the API and error structure)
    return (
      error.response &&
      error.response.status === 401 &&
      error.response.data.error.message === 'Access token has expired.'
    );
  }
}
