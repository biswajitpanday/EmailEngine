import { injectable } from 'inversify';
import { ElasticsearchRepository } from './ElasticSearchRepository';
import { Client } from '@elastic/elasticsearch';
import { IEmailSyncRepository } from '../../domain/interfaces/IEmailSyncRepository';
import { EmailSyncModel } from '../persistence/documents/EmailSyncModel';

@injectable()
export class EmailSyncRepository
  extends ElasticsearchRepository<EmailSyncModel>
  implements IEmailSyncRepository
{
  constructor() {
    super(new Client({ node: process.env.ELASTICSEARCH_HOST }), 'emails');
  }
}
