import { Container } from 'inversify';
import { HealthCheckController } from '../../presentation/controllers/HealthCheckController';
import { AuthController } from '../../presentation/controllers/AuthController';
import { TYPES } from './types';
import { IAuthService } from '../../application/interfaces/IAuthService';
import AuthService from '../../application/services/AuthService';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { UserRepository } from '../repositories/UserRepository';
import { ElasticsearchRepository } from '../repositories/ElasticSearchRepository';

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
//#endregion


export { container };
