import { Client } from '@elastic/elasticsearch';
import logger from '../../utils/Logger';
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
      node: process.env.ELASTICSEARCH_HOST || DEFAULT_ELASTICSEARCH_HOST,
      auth: {
        username: process.env.ELASTICSEARCH_USERNAME || '',
        password: process.env.ELASTICSEARCH_PASSWORD || '',
      },
    };

    // if (process.env.NODE_ENV === 'production') {
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

/**
 * Initialize Elasticsearch
 * @returns {Promise<Client>} Elasticsearch client
 */
const initializeElasticsearch = async (): Promise<Client> => {
  const esClient = await connectElasticsearch();

  // Check if the "users" index exists and create it if it doesn't
  const indexName = 'users';
  const indexExists = await esClient.indices.exists({ index: indexName });
  if (indexExists.statusCode === 404) {
    try {
      await esClient.indices.create({
        index: indexName,
        body: {
          mappings: {
            properties: {
              email: { type: 'text' },
              password: { type: 'text' },
              outlookToken: { type: 'text' },
            },
          },
        },
      });
      logger.info(`Index "${indexName}" created successfully.`);
    } catch (err) {
      logger.error(`Error creating index "${indexName}":`, err);
      process.exit(1);
    }
  } else {
    logger.info(`Index "${indexName}" already exists.`);
  }

  return esClient;
};

export default initializeElasticsearch;
