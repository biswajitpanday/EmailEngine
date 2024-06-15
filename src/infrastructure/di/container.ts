import { Container } from 'inversify';
import { HealthCheckController } from '../../presentation/controllers/HealthCheckController';

const container = new Container();

//#region Controllers
container.bind<HealthCheckController>(HealthCheckController).toSelf();
//#endregion


//#region Services
//#endregion

//#region Repositories
//#endregion


export { container };
