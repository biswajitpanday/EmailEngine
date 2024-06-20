import { ElasticsearchRepository } from '../../infrastructure/repositories/ElasticSearchRepository';
import { UserModel } from '../models/UserModel';

export interface IUserRepository extends ElasticsearchRepository<UserModel> {
  findByEmail(query: any): Promise<UserModel | null>;
}
