import { ElasticSearchDocument } from '../../infrastructure/persistence/documents/ElasticSearchDocument';

/**
 * Generic interface for Elasticsearch repository operations
 * @template T - The type of the document that extends ElasticSearchDocument
 */
export interface IElasticsearchRepository<T extends ElasticSearchDocument> {
  /**
   * Creates a new document in Elasticsearch.
   * @param document - The document to create
   * @returns The created document with the generated ID
   */
  create(document: T): Promise<T>;

  /**
   * Retrieves a document by its ID from Elasticsearch.
   * @param id - The ID of the document
   * @returns The retrieved document or null if not found
   */
  getById(id: string): Promise<T | null>;

  /**
   * Updates a document by its ID in Elasticsearch.
   * @param id - The ID of the document
   * @param document - The partial document to update
   * @returns The updated document or null if not found
   */
  update(id: string, document: Partial<T>): Promise<T | null>;

  /**
   * Deletes a document by its ID from Elasticsearch.
   * @param id - The ID of the document
   */
  delete(id: string): Promise<void>;

  /**
   * Searches for documents in Elasticsearch based on a query.
   * @param query - The search query
   * @returns An array of search results
   */
  search(query: any): Promise<T[]>;
}
