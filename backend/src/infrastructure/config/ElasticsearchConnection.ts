import { Client } from '@elastic/elasticsearch';
import logger from '../../utils/Logger';
import AppConst from '../../utils/Constants';
//import fs from 'fs';

const DEFAULT_ELASTICSEARCH_HOST = 'http://localhost:9200';

/**
 * Connect to Elasticsearch
 * @returns {Promise<Client>} Elasticsearch client
 */
const connectElasticsearch = async (): Promise<Client> => {
  try {
    logger.info(`Connecting to Elasticsearch...`);

    const esClientOptions: any = {
      node: AppConst.ElasticSearchHost || DEFAULT_ELASTICSEARCH_HOST,
      auth: {
        password: AppConst.ElasticSearchPassword,
        username: AppConst.ElasticSearchUserName,
      },
    };

    // if (AppConst.NodeEnv === 'production') {
    //   const ca = fs.readFileSync('./certs/elasticsearch.crt');
    //   const httpsAgent = new https.Agent({
    //     ca,
    //     rejectUnauthorized: true, // Set to true for production
    //   });
    //   esClientOptions.ssl = {
    //     ca,
    //     rejectUnauthorized: true, // Set to true for production
    //   };
    //   esClientOptions.agent = httpsAgent;
    // }

    const esClient = new Client(esClientOptions);

    logger.info(`Successfully connected to Elasticsearch...`);
    const health = await esClient.cluster.health({});
    logger.info(
      `Elasticsearch connected successfully\nHealth: ${JSON.stringify(health)}`,
    );
    return esClient;
  } catch (err) {
    logger.error('Elasticsearch connection error:', err);
    process.exit(1); // Exit the process if Elasticsearch connection fails
  }
};

export default connectElasticsearch;
