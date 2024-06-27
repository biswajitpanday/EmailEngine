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
import { ElasticSearchController } from '../../presentation/controllers/ElasticSearchController';
import { EmailController } from '../../presentation/controllers/EmailController';
import { IEmailSyncService } from '../../application/interfaces/IEmailSyncService';

const container = new Container({ skipBaseClassChecks: true });

const initializeIocContainer = async (esClient: Client) => {
  container.bind<Client>(TYPES.ElasticsearchClient).toConstantValue(esClient);

  container.bind<HealthCheckController>(HealthCheckController).toSelf();
  container.bind<AuthController>(TYPES.AuthController).to(AuthController);
  container.bind<EmailController>(TYPES.AuthController).to(EmailController);
  container
    .bind<ElasticSearchController>(TYPES.ElasticSearchController)
    .to(ElasticSearchController);

  container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
  container.bind<OAuthService>(TYPES.OAuthService).to(OAuthService);
  container
    .bind<IEmailSyncService>(TYPES.EmailSyncService)
    .to(EmailSyncService);

  container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
  container
    .bind<IEmailSyncRepository>(TYPES.EmailSyncRepository)
    .to(EmailSyncRepository);
  container
    .bind<IElasticsearchRepository<any>>(TYPES.ElasticsearchRepository)
    .to(ElasticsearchRepository);

  return container;
};

export { container, initializeIocContainer };
