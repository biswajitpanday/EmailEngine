import { controller, httpGet } from 'inversify-express-utils';
import { Request, Response } from 'express';
import connectDB from '../../infrastructure/config/MongooseConnection';
import { TYPES } from '../../infrastructure/di/types';
import { inject } from 'inversify';
import { Client } from '@elastic/elasticsearch';

@controller('/health')
export class HealthCheckController {
  constructor(@inject(TYPES.ElasticsearchClient) private esClient: Client) {}

  @httpGet('/')
  public async healthCheck(req: Request, res: Response): Promise<Response> {
    const healthStatus = {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: await this.checkDatabaseStatus(),
      elasticsearch: await this.checkElasticsearchStatus(),
    };

    return res.json(healthStatus);
  }

  private async checkDatabaseStatus(): Promise<string> {
    try {
      await connectDB();
      return 'Mongodb connected Successfully...';
    } catch (error) {
      return 'disconnected';
    }
  }

  private async checkElasticsearchStatus(): Promise<string> {
    try {
      const health = await this.esClient.cluster.health({});
      return `Elasticsearch connected Successfully... Health: ${JSON.stringify(health?.body)}`;
    } catch (error) {
      return 'disconnected';
    }
  }
}
