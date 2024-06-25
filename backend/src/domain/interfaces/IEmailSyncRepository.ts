import { EmailSyncModel } from '../../infrastructure/persistence/documents/EmailSyncModel';
import { IElasticsearchRepository } from './IElasticSearchRepository';

export interface IEmailSyncRepository
  extends IElasticsearchRepository<EmailSyncModel> {}
