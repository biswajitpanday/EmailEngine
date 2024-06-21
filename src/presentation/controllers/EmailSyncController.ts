import { Request, Response } from 'express';
import { controller, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../../infrastructure/di/types';
import logger from '../../utils/Logger';
import { EmailSyncService } from '../../application/services/EmailSyncService';

@controller('/sync')
export class EmailSyncController {
  constructor(
    @inject(TYPES.EmailSyncService) private emailSyncService: EmailSyncService,
  ) {}

  @httpGet('/emails/:userId')
  public async syncEmails(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      await this.emailSyncService.syncUserEmails(userId);
      res.status(200).json({ message: 'Emails synchronized successfully' });
    } catch (error) {
      logger.error('Error during email synchronization:', error);
      res.status(500).json({ message: 'Error during email synchronization' });
    }
  }
}
