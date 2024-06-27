import { Request, Response } from 'express';
import { controller, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../../infrastructure/di/types';
import { IAuthService } from '../../application/interfaces/IAuthService';

@controller('/api/auth')
export class AuthController {
  constructor(@inject(TYPES.AuthService) private authService: IAuthService) {}

  @httpPost('/login')
  public async login(req: Request, res: Response): Promise<void> {
    const { idToken } = req.body;
    if (idToken == null) {
      res.status(404).json({ error: 'Id Token is undefined' });
    }
    const obToken = await this.authService.getOnBehalfToken(idToken);
    res.json({ token: obToken });
  }
}
