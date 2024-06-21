import { Container } from 'inversify';
import { HealthCheckController } from '../../presentation/controllers/HealthCheckController';
import { AuthController } from '../../presentation/controllers/AuthController';
import { TYPES } from './types';
import { IAuthService } from '../../application/interfaces/IAuthService';
import AuthService from '../../application/services/AuthService';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { UserRepository } from '../repositories/UserRepository';
import { Client } from '@elastic/elasticsearch';
import { IElasticsearchRepository } from '../../domain/interfaces/IElasticSearchRepository';
import { ElasticsearchRepository } from '../repositories/ElasticSearchRepository';
import { OAuthService } from '../../application/services/OAuthService';
import { EmailSyncService } from '../../application/services/EmailSyncService';
import { EmailSyncRepository } from '../repositories/EmailSyncRepository';
import { IEmailSyncRepository } from '../../domain/interfaces/IEmailSyncRepository';

const container = new Container({ skipBaseClassChecks: true });

const initializeIocContainer = async (esClient: Client) => {
  // Bind Elasticsearch Client
  container.bind<Client>(TYPES.ElasticsearchClient).toConstantValue(esClient);

  //#region Bind Controllers
  container.bind<HealthCheckController>(HealthCheckController).toSelf();
  container.bind<AuthController>(TYPES.AuthController).to(AuthController);
  //#endregion

  //#region Bind Services
  container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
  container.bind<OAuthService>(TYPES.OAuthService).to(OAuthService);
  container.bind<EmailSyncService>(TYPES.EmailSyncService).to(EmailSyncService);
  //#endregion

  //#region Bind Repositories
  container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
  container
    .bind<IEmailSyncRepository>(TYPES.EmailSyncRepository)
    .to(EmailSyncRepository);
  container
    .bind<IElasticsearchRepository<any>>(TYPES.ElasticsearchRepository)
    .to(ElasticsearchRepository);
  //#endregion

  return container;
};

export { container, initializeIocContainer };
