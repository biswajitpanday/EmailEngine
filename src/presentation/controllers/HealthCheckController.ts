import { controller, httpGet } from 'inversify-express-utils';
import { Request, Response } from 'express';
import connectDB from '../../infrastructure/config/MongooseConnection'; // Assuming this function is exported for checking DB status

@controller('/health')
export class HealthCheckController {
  @httpGet('/')
  public async healthCheck(req: Request, res: Response): Promise<Response> {
    const healthStatus = {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: await this.checkDatabaseStatus(),
    };

    return res.json(healthStatus);
  }

  private async checkDatabaseStatus(): Promise<string> {
    try {
      await connectDB(); // Or any method to check DB connection
      return 'connected';
    } catch (error) {
      return 'disconnected';
    }
  }
}
