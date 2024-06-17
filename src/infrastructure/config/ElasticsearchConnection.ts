import { Client } from '@elastic/elasticsearch';
import logger from '../../utils/Logger';

const DEFAULT_ELASTICSEARCH_HOST = 'http://localhost:9200';

/**
 * Connect to Elasticsearch
 * @returns {Promise<Client>} Elasticsearch client
 */
const connectElasticsearch = async (): Promise<Client> => {
  const esClient = new Client({
    node: process.env.ELASTICSEARCH_HOST || DEFAULT_ELASTICSEARCH_HOST,
  });

  try {
    await esClient.ping();
    logger.info('Elasticsearch connected successfully');
  } catch (err) {
    logger.error('Elasticsearch connection error:', err);
    process.exit(1); // Exit the process if Elasticsearch connection fails
  }

  return esClient;
};

/**
 * Initialize Elasticsearch
 * @returns {Promise<Client>} Elasticsearch client
 */
const initializeElasticsearch = async (): Promise<Client> => {
  const esClient = await connectElasticsearch();
  // You can set up indices or perform initial checks here if needed
  return esClient;
};

export default initializeElasticsearch;
