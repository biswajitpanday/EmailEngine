import { injectable } from 'inversify';
import { ElasticsearchRepository } from './ElasticSearchRepository';
import { Client } from '@elastic/elasticsearch';
import { IEmailSyncRepository } from '../../domain/interfaces/IEmailSyncRepository';
import { EmailSyncModel } from '../persistence/documents/EmailSyncModel';
import AppConst from '../../utils/Constants';

@injectable()
export class EmailSyncRepository
  extends ElasticsearchRepository<EmailSyncModel>
  implements IEmailSyncRepository
{
  constructor() {
    super(new Client({ node: AppConst.ElasticSearchHost }), 'emails');
  }
}
