import { controller, httpGet } from 'inversify-express-utils';
import { Request, Response } from 'express';
import { TYPES } from '../../infrastructure/di/types';
import { inject } from 'inversify';
import { IEmailSyncService } from '../../application/interfaces/IEmailSyncService';

@controller('/api/email')
export class EmailController {
  constructor(
    @inject(TYPES.EmailSyncService)
    private emailSyncService: IEmailSyncService,
  ) {}

  @httpGet('/get')
  public async getEmails(req: Request, res: Response): Promise<void> {
    try {
      const accessToken = this.extractToken(req, res);
      const emails = await this.emailSyncService.synchronizeEmails(accessToken);
      res.json(emails);
    } catch (error: any) {
      res.status(500).json({ error: error?.message });
    }
  }

  private extractToken(req: Request, res: Response): any {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ error: 'Missing or invalid Authorization header' });
    }
    const accessToken = authHeader.split(' ')[1];
    return accessToken;
  }
}
