import { ElasticSearchDocument } from '../../infrastructure/persistence/documents/ElasticSearchDocument';
import { IPagedResponse } from '../models/IPagedResponse';
import { PagingRequest } from '../models/PagingRequest';

/**
 * Generic interface for Elasticsearch repository operations
 * @template T - The type of the document that extends ElasticSearchDocument
 */
export interface IElasticsearchRepository<T extends ElasticSearchDocument> {
  /**
   * Filters documents based on query, paging, and sorting criteria.
   * @param query - Elasticsearch query object
   * @param paging - Paging request object
   * @param sort - Sorting criteria
   * @returns A paginated response containing the list of documents and count
   */
  filter(
    query?: any,
    paging?: PagingRequest,
    sort?: any,
  ): Promise<IPagedResponse<T>>;

  /**
   * Retrieves a document by its ID from Elasticsearch.
   * @param id - The ID of the document
   * @returns The retrieved document or null if not found
   */
  getById(id: string): Promise<T | null>;

  /**
   * Finds a single document based on query.
   * @param query - Elasticsearch query object
   * @returns The found document
   */
  findOne(query: any): Promise<T | null>;

  /**
   * Creates a new document in Elasticsearch.
   * @param document - The document to create
   * @returns The created document with the generated ID
   */
  create(document: T): Promise<T>;

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
   * Counts the number of documents based on query.
   * @param query - Elasticsearch query object
   * @returns The count of documents
   */
  count(query: any): Promise<number>;

  /**
   * Finds multiple documents based on query.
   * @param query - Elasticsearch query object
   * @returns The list of found documents
   */
  find(query: any): Promise<T[]>;

  /**
   * Finds a single document based on query.
   * @param query - Elasticsearch query object
   * @returns The found document
   */
  findOne(query: any): Promise<T | null>;
}
