import { injectable } from 'inversify';
import { ElasticsearchRepository } from './ElasticSearchRepository';
import { Client } from '@elastic/elasticsearch';
import { IEmailSyncRepository } from '../../domain/interfaces/IEmailSyncRepository';
import AppConst from '../../utils/Constants';
import logger from '../../utils/Logger';
import { EmailModel } from '../persistence/documents/EmailModel';

@injectable()
export class EmailSyncRepository
  extends ElasticsearchRepository<EmailModel>
  implements IEmailSyncRepository
{
  constructor() {
    super(new Client({ node: AppConst.ElasticSearchHost }), 'emails');
  }

  public async createOrUpdate(emailDocument: EmailModel): Promise<void> {
    const existingEmail = await this.findByEmailId(emailDocument.id!);
    if (!existingEmail) {
      await this.create(emailDocument);
    } else {
      await this.update(existingEmail.id!, emailDocument);
    }
  }

  public async findByEmailId(id: string): Promise<EmailModel | null> {
    const body = {
      match: { id },
    };
    const result = await this.findOne(body);
    if (result) {
      logger.info(`Email found with emailId: ${id}`);
      return result;
    }
    logger.warn(`No email found with emailId: ${id}`);
    return null;
  }

  public async findByUserId(userId: any): Promise<EmailModel | null> {
    const body = {
      match: { userId },
    };
    const result = await this.findOne(body);
    if (result) {
      logger.info(`Email found with userId: ${userId}`);
      return result;
    }
    logger.warn(`No email found with userId: ${userId}`);
    return null;
  }
}
