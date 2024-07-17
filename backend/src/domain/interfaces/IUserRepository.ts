import { UserModel } from '../../infrastructure/persistence/documents/UserModel';
import { IElasticsearchRepository } from './IElasticSearchRepository';

export interface IUserRepository extends IElasticsearchRepository<UserModel> {
  findByEmail(email: string): Promise<UserModel | null>;
}
