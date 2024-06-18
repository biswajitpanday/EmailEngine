import * as mongoose from 'mongoose';
import { IPagedResponse } from '../models/IPagedResponse';
import { PagingRequest } from '../models/PagingRequest';
import { IBaseModel } from '../../infrastructure/persistence/schemas/IBaseModel';

/**
 * Generic interface for repository operations
 * @template T - The type of the model that extends IBaseModel
 */
export interface IRepositoryBase<T extends IBaseModel> {
  /**
   * Filters documents based on query, paging, and sorting criteria.
   * @param query - MongoDB query object
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
   * Finds a document by its ID.
   * @param id - Document ID
   * @returns The found document
   */
  findById(id: string): Promise<T>;

  /**
   * Finds a single document based on query.
   * @param query - MongoDB query object
   * @returns The found document
   */
  findOne(query: any): Promise<T>;

  /**
   * Creates a new document.
   * @param item - The document to create
   * @returns The created document
   */
  create(item: T): Promise<T>;

  /**
   * Updates a document based on query.
   * @param query - MongoDB query object
   * @param item - The document to update
   * @returns The updated document or null if not found
   */
  update(query: any, item: T): Promise<T | null>;

  /**
   * Removes a document by its ID.
   * @param id - Document ID
   * @returns The removed document
   */
  remove(id: string): Promise<T>;

  /**
   * Converts a string ID to a MongoDB ObjectId.
   * @param id - String ID
   * @returns The ObjectId
   */
  toObjectId(id: string): mongoose.Types.ObjectId;

  /**
   * Counts the number of documents based on query.
   * @param query - MongoDB query object
   * @returns The count of documents
   */
  count(query: any): Promise<number>;

  /**
   * Finds multiple documents based on query.
   * @param query - MongoDB query object
   * @returns The list of found documents
   */
  find(query: any): Promise<T[]>;
}
