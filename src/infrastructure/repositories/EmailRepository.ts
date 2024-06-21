import { injectable } from 'inversify';
import { IEmailRepository } from '../../domain/interfaces/IEmailRepository';
import { ElasticsearchRepository } from './ElasticSearchRepository';
import { Client } from '@elastic/elasticsearch';
import { EmailModel } from '../persistence/documents/EmailModel';

@injectable()
export class EmailRepository
  extends ElasticsearchRepository<EmailModel>
  implements IEmailRepository
{
  constructor() {
    super(new Client({ node: process.env.ELASTICSEARCH_HOST }), 'emails');
  }

  /**
   * Finds emails by user ID.
   * @param userId - The user's ID.
   * @returns List of emails.
   */
  public async findByUserId(userId: string): Promise<EmailModel[]> {
    const body = {
      query: {
        term: {
          userId,
        },
      },
    };

    return await this.find(body);
  }
}
