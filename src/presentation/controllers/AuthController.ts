import { Request, Response } from 'express';
import { controller, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../../infrastructure/di/types';
import logger from '../../utils/Logger';
import { UserModel } from '../../infrastructure/persistence/documents/UserModel';
import { OAuthService } from '../../application/services/OAuthService';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import jwt from 'jsonwebtoken';
import IDecodedToken from '../../domain/models/IDecodedToken';

@controller('/auth')
export class AuthController {
  constructor(
    @inject(TYPES.OAuthService) private oAuthService: OAuthService,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
  ) {}

  @httpGet('/outlook')
  public async redirectToOutlook(req: Request, res: Response): Promise<void> {
    const redirectUri = `${process.env.APP_URL}/auth/outlook/callback`;
    const authorizationUrl = this.oAuthService.getAuthorizationUrl(redirectUri);
    res.redirect(authorizationUrl);
  }

  @httpGet('/outlook/callback')
  public async handleOutlookCallback(
    // TODO: MOVE THIS LOGIC TO SEPARATE SERVICE OR PROVIDER
    req: Request,
    res: Response,
  ): Promise<void> {
    const { code } = req.query;
    const redirectUri = `${process.env.APP_URL}/auth/outlook/callback`;

    try {
      const token = await this.oAuthService.getTokenFromCode(
        code as string,
        redirectUri,
      );

      if (typeof token.id_token === 'string') {
        const decodedToken = jwt.decode(token.id_token) as IDecodedToken;

        if (
          decodedToken &&
          (decodedToken.preferred_username || decodedToken.email)
        ) {
          const email = decodedToken.email || decodedToken.preferred_username;
          if (email) {
            const user = new UserModel(
              email,
              undefined,
              token.access_token as any,
              token.refresh_token as any,
            );
            const existingUser = await this.userRepository.findByEmail(email);
            if (existingUser && existingUser?.id) {
              await this.userRepository.update(existingUser.id, user);
            } else {
              await this.userRepository.create(user);
            }

            res
              .status(200)
              .json({ message: 'Account linked successfully', user });
          } else {
            throw new Error('Email not found in token');
          }
        }
      } else {
        throw new Error('Invalid id_token type');
      }
    } catch (error) {
      logger.error('OAuth callback error', error);
      res.status(500).json({ error: 'OAuth callback failed' });
    }
  }
}
