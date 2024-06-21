import { Client } from '@elastic/elasticsearch';
import logger from '../../utils/Logger';

/**
 * Initialize Elasticsearch
 * @returns {Promise<Client>} Elasticsearch client
 */
const initializeElasticSearchIndexing = async (
  esClient: Client,
): Promise<Client> => {
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
              email: { type: 'keyword' },
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

export { initializeElasticSearchIndexing };
