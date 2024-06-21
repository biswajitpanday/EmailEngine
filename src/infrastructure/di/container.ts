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
import { IEmailRepository } from '../../domain/interfaces/IEmailRepository';
import { EmailRepository } from '../repositories/EmailRepository';
import { IEmailSyncService } from '../../application/interfaces/IEmailSyncService';
import { OutlookService } from '../../application/services/adapters/OutlookService';
import { EmailSyncController } from '../../presentation/controllers/EmailSyncController';
import { EmailSyncService } from '../../application/services/EmailSyncService';

const container = new Container({ skipBaseClassChecks: true });

const initializeIocContainer = async (esClient: Client) => {
  container.bind<Client>(TYPES.ElasticsearchClient).toConstantValue(esClient);

  container.bind<HealthCheckController>(HealthCheckController).toSelf();
  container.bind<AuthController>(TYPES.AuthController).to(AuthController);
  container
    .bind<EmailSyncController>(TYPES.EmailSyncController)
    .to(EmailSyncController);

  container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
  container.bind<EmailSyncService>(TYPES.EmailSyncService).to(EmailSyncService);
  container.bind<IEmailSyncService>(TYPES.OutlookService).to(OutlookService);

  container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
  container.bind<IEmailRepository>(TYPES.EmailRepository).to(EmailRepository);
  container
    .bind<IElasticsearchRepository<any>>(TYPES.ElasticsearchRepository)
    .to(ElasticsearchRepository);

  return container;
};

export { container, initializeIocContainer };
