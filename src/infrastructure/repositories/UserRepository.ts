import { injectable } from 'inversify';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { ElasticsearchRepository } from './ElasticSearchRepository';
import { Client } from '@elastic/elasticsearch';
import logger from '../../utils/Logger';
import { UserModel } from '../persistence/documents/UserModel';

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
      term: {
        email: email,
      },
    };

    const result = await this.findOne(body);
    if (result && result.email) {
      logger.info(`User found with email: ${email}`);
      return result;
    }

    logger.warn(`No user found with email: ${email}`);
    return null;
  }
}
