import { controller, httpGet } from 'inversify-express-utils';

@controller('/health')
export class HealthCheckController {
  @httpGet('/')
  public healthCheck() {
    return { status: 'ok' };
  }
}
