import { injectable } from 'inversify';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { ElasticsearchRepository } from './ElasticSearchRepository';
import { UserModel } from '../../domain/models/UserModel';
import { Client } from '@elastic/elasticsearch';
import logger from '../../utils/Logger';

@injectable()
export class UserRepository
  extends ElasticsearchRepository<UserModel>
  implements IUserRepository
{
  constructor() {
    super(new Client({ node: process.env.ELASTICSEARCH_HOST }), 'users');
  }

  /**
   * Finds a user by their email.
   * @param email - The user's email address.
   * @returns The user document or null if not found.
   */
  public async findByEmail(email: any): Promise<UserModel | null> {
    const body = {
      query: {
        match: { email },
      },
    };

    const results = await this.search(body);
    if (results.length > 0) {
      logger.info(`User found with email: ${email}`);
      return results[0];
    }

    logger.warn(`No user found with email: ${email}`);
    return null;
  }
}
