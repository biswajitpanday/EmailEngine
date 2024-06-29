import { injectable } from 'inversify';
import { ElasticsearchRepository } from './ElasticSearchRepository';
import { Client } from '@elastic/elasticsearch';
import { IEmailSyncRepository } from '../../domain/interfaces/IEmailSyncRepository';
import { EmailSyncModel } from '../persistence/documents/EmailSyncModel';
import AppConst from '../../utils/Constants';
import logger from '../../utils/Logger';

@injectable()
export class EmailSyncRepository
  extends ElasticsearchRepository<EmailSyncModel>
  implements IEmailSyncRepository
{
  constructor() {
    super(new Client({ node: AppConst.ElasticSearchHost }), 'emails');
  }

  public async createOrUpdate(emailDocument: EmailSyncModel): Promise<void> {
    const existingEmail = await this.findByEmailId(emailDocument.emailId);
    if (!existingEmail) {
      await this.create(emailDocument);
    } else {
      await this.update(existingEmail.id!, emailDocument);
    }
  }

  public async findByEmailId(emailId: any): Promise<EmailSyncModel | null> {
    const body = {
      match: { emailId },
    };
    const result = await this.findOne(body);
    if (result) {
      logger.info(`Email found with emailId: ${emailId}`);
      return result;
    }
    logger.warn(`No email found with emailId: ${emailId}`);
    return null;
  }
}
