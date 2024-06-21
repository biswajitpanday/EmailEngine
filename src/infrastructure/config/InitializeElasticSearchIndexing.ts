import { Client } from '@elastic/elasticsearch';
import logger from '../../utils/Logger';
import userMappings from '../persistence/mappings/UserMappings';
import emailMappings from '../persistence/mappings/EmailMappings';

const initializeElasticsearchIndexing = async (
  esClient: Client,
): Promise<Client> => {
  const indices = [
    { name: 'users', mappings: userMappings },
    { name: 'emails', mappings: emailMappings },
  ];

  for (const { name, mappings } of indices) {
    const indexExists = await esClient.indices.exists({ index: name });
    if (!indexExists.body) {
      // Create index if it doesn't exist
      try {
        await esClient.indices.create({
          index: name,
          body: mappings,
        });
        logger.info(`Index "${name}" created successfully.`);
      } catch (err) {
        logger.error(`Error creating index "${name}":`, err);
        process.exit(1);
      }
    } else {
      // Check and update mappings if necessary
      logger.info(`Index "${name}" already exists.`);
      try {
        const currentMappings = await esClient.indices.getMapping({
          index: name,
        });
        if (
          JSON.stringify(currentMappings.body[name].mappings) !==
          JSON.stringify(mappings.mappings)
        ) {
          logger.warn(
            `Mappings for index "${name}" are different. Reindexing...`,
          );

          // Create new index with updated mappings
          const newIndexName = `${name}_v2`;
          const newIndexExists = await esClient.indices.exists({
            index: newIndexName,
          });
          if (!newIndexExists.body) {
            await esClient.indices.create({
              index: newIndexName,
              body: mappings,
            });
            logger.info(`New index "${newIndexName}" created successfully.`);

            // Reindex data from old index to new index
            await esClient.reindex({
              body: {
                source: { index: name },
                dest: { index: newIndexName },
              },
            });
            logger.info(`Data reindexed from "${name}" to "${newIndexName}".`);

            // Update alias to point to the new index
            const aliasName = name;
            const aliasExists = await esClient.indices.existsAlias({
              name: aliasName,
            });
            if (aliasExists.body) {
              await esClient.indices.updateAliases({
                body: {
                  actions: [
                    { add: { index: newIndexName, alias: aliasName } },
                    { remove: { index: name, alias: aliasName } },
                  ],
                },
              });
            } else {
              await esClient.indices.putAlias({
                index: newIndexName,
                name: aliasName,
              });
            }
            logger.info(
              `Alias updated to point from "${name}" to "${newIndexName}".`,
            );

            // Optionally delete old index if it was not deleted already
            const oldIndexExists = await esClient.indices.exists({
              index: name,
            });
            if (oldIndexExists.body) {
              await esClient.indices.delete({ index: name });
              logger.info(`Old index "${name}" deleted successfully.`);
            }
          } else {
            logger.info(
              `New index "${newIndexName}" already exists. Skipping creation.`,
            );
          }
        }
      } catch (err) {
        logger.error(`Error updating mappings for index "${name}":`, err);
        process.exit(1);
      }
    }
  }
  return esClient;
};

export { initializeElasticsearchIndexing };
