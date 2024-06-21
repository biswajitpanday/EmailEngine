import { NextFunction, Request, Response } from 'express';
import { controller, httpGet, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../../infrastructure/di/types';
import { AuthenticationError } from '../../utils/ErrorHandler';
import logger from '../../utils/Logger';
import { UserModel } from '../../infrastructure/persistence/documents/UserModel';
import { IAuthService } from '../../application/interfaces/IAuthService';
import passport from 'passport';

@controller('/auth')
export class AuthController {
  constructor(@inject(TYPES.AuthService) private authService: IAuthService) {}

  @httpGet('/outlook')
  public async initiateOutlookAuth(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      passport.authenticate('outlook')(req, res, next);
    } catch (error) {
      logger.error('Error initiating Outlook authentication:', error);
      this.handleError(res, error);
    }
  }

  // @httpGet('/outlook')
  // public initiateOutlookAuth(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ): void {
  //   passport.authenticate('outlook', {
  //     scope: [
  //       'openid',
  //       'profile',
  //       'offline_access',
  //       'https://outlook.office.com/mail.read',
  //     ],
  //   })(req, res, next);
  // }

  @httpGet('/outlook/callback')
  public async handleOutlookCallback(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      passport.authenticate(
        'outlook',
        async (err: unknown, user: Express.User, _info: any) => {
          if (err) {
            return this.handleError(res, err);
          }
          if (!user) {
            return res.redirect('/login'); // Redirect to login if user not authenticated
          }
          req.logIn(user, async (loginErr) => {
            if (loginErr) {
              return this.handleError(res, loginErr);
            }
            // User is logged in, handle post-login logic here
            res.redirect('/account/success');
          });
        },
      )(req, res, next);
    } catch (error) {
      logger.error('Error handling Outlook callback:', error);
      this.handleError(res, error);
    }
  }

  // @httpGet('/outlook/callback')
  // public handleOutlookCallback(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ): void {
  //   passport.authenticate(
  //     'outlook',
  //     { failureRedirect: '/login' },
  //     (err: any, user: Express.User, _info: any) => {
  //       if (err) {
  //         return next(err);
  //       }
  //       if (!user) {
  //         return res.redirect('/login');
  //       }
  //       req.logIn(user, (loginErr) => {
  //         if (loginErr) {
  //           return next(loginErr);
  //         }
  //         return res.redirect('/account/success');
  //       });
  //     },
  //   )(req, res, next);
  // }

  @httpPost('/account/create')
  public async createAccount(req: Request, res: Response): Promise<void> {
    try {
      const { email, accessToken } = req.body;
      const user = new UserModel(email, accessToken);
      await this.authService.createOrUpdateUser(user);
      res.status(201).json({ message: 'Account created successfully' });
    } catch (error) {
      logger.error('Error during account creation:', error);
      this.handleError(res, error);
    }
  }

  private handleError(res: Response, error: unknown): void {
    if (error instanceof AuthenticationError) {
      res.status(401).json({ message: error.message });
    } else if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error occurred' });
    }
  }
}
