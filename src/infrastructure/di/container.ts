import { Container } from 'inversify';
import { HealthCheckController } from '../../presentation/controllers/HealthCheckController';
import { AuthController } from '../../presentation/controllers/AuthController';
import { TYPES } from './types';
import { IAuthService } from '../../application/interfaces/IAuthService';
import AuthService from '../../application/services/AuthService';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { UserRepository } from '../repositories/UserRepository';
import { ElasticsearchRepository } from '../repositories/ElasticSearchRepository';
import { Client } from '@elastic/elasticsearch';

const container = new Container({skipBaseClassChecks: true});

//#region Controllers
container.bind<HealthCheckController>(HealthCheckController).toSelf();
container.bind<AuthController>(TYPES.AuthController).to(AuthController);
//#endregion


//#region Services
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
//#endregion

//#region Repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);

// const elasticsearchClient = new Client({ node: process.env.ELASTICSEARCH_HOST });
// container.bind(ElasticsearchRepository).toDynamicValue(() => new ElasticsearchRepository(elasticsearchClient, 'indexName'));
//#endregion


export { container };
