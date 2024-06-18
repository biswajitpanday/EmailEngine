import { injectable } from 'inversify';
import { RepositoryBase } from './RepositoryBase';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { IUserDocument, UserSchema } from '../persistence/schemas/UserSchema';

@injectable()
export class UserRepository
  extends RepositoryBase<IUserDocument>
  implements IUserRepository
{
  constructor() {
    super();
    this.schema = UserSchema;
  }
}
