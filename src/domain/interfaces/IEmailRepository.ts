import { EmailModel } from '../../infrastructure/persistence/documents/EmailModel';
import { IElasticsearchRepository } from './IElasticSearchRepository';

export interface IEmailRepository extends IElasticsearchRepository<EmailModel> {
  findByUserId(userId: string): Promise<EmailModel[]>;
}
