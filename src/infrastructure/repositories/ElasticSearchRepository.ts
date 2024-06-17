import { Client } from "@elastic/elasticsearch";
import logger from "../../utils/Logger";
import { ElasticSearchDocument } from "../persistence/documents/ElasticSearchDocument";
import { IElasticsearchRepository } from "../../domain/interfaces/IElasticSearchRepository";

export class ElasticsearchRepository<T extends ElasticSearchDocument>
  implements IElasticsearchRepository<T>
{
  protected readonly client: Client;
  protected readonly indexName: string;

  constructor(client: Client, indexName: string) {
    this.client = client;
    this.indexName = indexName;
  }

  /**
   * Creates a new document in the Elasticsearch index.
   * @param document - The document to create.
   * @returns The created document with the generated ID.
   */
  public async create(document: T): Promise<T> {
    try {
      const response = (await this.client.index({
        index: this.indexName,
        body: document,
      })) as any;

      logger.info(
        `Document created in index ${this.indexName} with ID: ${response.body._id}`
      );
      return { ...document, id: response.body._id }; // Include generated ID
    } catch (err) {
      logger.error(`Error creating document in index ${this.indexName}:`, err);
      throw new Error("Error creating document");
    }
  }

  /**
   * Searches for documents in the Elasticsearch index based on a query.
   * @param query - The search query.
   * @returns An array of search results.
   */
  public async search(query: any): Promise<any[]> {
    try {
      const response = (await this.client.search({
        index: this.indexName,
        body: query,
      })) as any;

      logger.info(`Search query executed in index ${this.indexName}`);
      return response.body.hits.hits.map((hit: any) => ({
        ...hit._source,
        id: hit._id,
      })); // Include source and ID in results
    } catch (err) {
      logger.error(
        `Error executing search query in index ${this.indexName}:`,
        err
      );
      throw new Error("Error executing search query");
    }
  }

  /**
   * Retrieves a document by its ID from the Elasticsearch index.
   * @param id - The ID of the document.
   * @returns The retrieved document or null if not found.
   */
  public async getById(id: string): Promise<T | null> {
    try {
      const response = (await this.client.get({
        index: this.indexName,
        id,
      })) as any;

      logger.info(
        `Document retrieved from index ${this.indexName} with ID: ${id}`
      );
      return response.body
        ? { ...response.body._source, id: response.body._id }
        : null; // Include source and ID in result or null
    } catch (err: any) {
      logger.error(
        `Error retrieving document from index ${this.indexName} with ID: ${id}`,
        err
      );
      if (err.meta && err.meta.statusCode === 404) {
        return null;
      }
      throw new Error("Error retrieving document");
    }
  }

  /**
   * Updates a document by its ID in the Elasticsearch index.
   * @param id - The ID of the document.
   * @param document - The partial document to update.
   * @returns The updated document or null if not found.
   */
  public async update(id: string, document: Partial<T>): Promise<T | null> {
    try {
      const updateResult = (await this.client.update({
        index: this.indexName,
        id,
        body: { doc: document }, // Use doc for partial updates
      })) as any;

      logger.info(`Document updated in index ${this.indexName} with ID: ${id}`);
      if (updateResult.body.result === "updated") {
        const updatedDoc = await this.getById(id);
        return updatedDoc;
      }
      return null;
    } catch (err) {
      logger.error(
        `Error updating document in index ${this.indexName} with ID: ${id}`,
        err
      );
      throw new Error("Error updating document");
    }
  }

  /**
   * Deletes a document by its ID from the Elasticsearch index.
   * @param id - The ID of the document.
   */
  public async delete(id: string): Promise<void> {
    try {
      await this.client.delete({
        index: this.indexName,
        id,
      });

      logger.info(
        `Document deleted from index ${this.indexName} with ID: ${id}`
      );
    } catch (err) {
      logger.error(
        `Error deleting document from index ${this.indexName} with ID: ${id}`,
        err
      );
      throw new Error("Error deleting document");
    }
  }
}
