import { Request, Response } from 'express';
import { controller, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../../infrastructure/di/types';
import AuthService from '../../application/services/AuthService';

@controller('/auth')
export class AuthController {
  constructor(
    @inject(TYPES.AuthService) private authService: AuthService
) {}

  @httpPost('/register')
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await this.authService.register(email, password);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'Unknown error occurred' });
      }
    }
  }

  @httpPost('/login')
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await this.authService.login(email, password);
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ message: error.message });
      } else {
        res.status(401).json({ message: 'Unknown error occurred' });
      }
    }
  }
}
