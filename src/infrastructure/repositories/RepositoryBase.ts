import { injectable } from 'inversify';
import * as mongoose from 'mongoose';
import { IBaseModel } from '../persistence/schemas/IBaseModel';
import { IRepositoryBase } from '../../domain/interfaces/IRepositoryBase';
import { PagingRequest } from '../../domain/models/PagingRequest';
import { IPagedResponse } from '../../domain/models/IPagedResponse';

@injectable()
export abstract class RepositoryBase<T extends IBaseModel>
  implements IRepositoryBase<T>
{
  private model!: mongoose.Model<T>;

  set schema(schema: mongoose.Model<T>) {
    this.model = schema;
  }

  /**
   * Filters documents based on query, paging, and sorting criteria.
   * @param query - MongoDB query object
   * @param paging - Paging request object
   * @param sort - Sorting criteria
   * @returns A paginated response containing the list of documents and count
   */
  public async filter(
    query?: any,
    paging?: PagingRequest,
    sort?: any,
  ): Promise<IPagedResponse<T>> {
    try {
      const [list, count] = await Promise.all([
        this.collectionFilter(query, paging, sort),
        this.count(query),
      ]);
      return { count, list };
    } catch (err) {
      throw new Error(`Failed to filter documents: ${JSON.stringify(err)}`);
    }
  }

  /**
   * Finds a single document based on query.
   * @param query - MongoDB query object
   * @returns The found document
   */
  public async findOne(query: any): Promise<T> {
    try {
      return (await this.model.findOne(query).exec()) as T;
    } catch (err) {
      throw new Error(`Failed to find document: ${JSON.stringify(err)}`);
    }
  }

  /**
   * Finds multiple documents based on query.
   * @param query - MongoDB query object
   * @returns The list of found documents
   */
  public async find(query: any): Promise<T[]> {
    try {
      return (await this.model.find(query).exec()) as T[];
    } catch (err) {
      throw new Error(`Failed to find documents: ${JSON.stringify(err)}`);
    }
  }

  /**
   * Counts the number of documents based on query.
   * @param query - MongoDB query object
   * @returns The count of documents
   */
  public async count(query: any): Promise<number> {
    try {
      return await this.model.countDocuments(query).exec();
    } catch (err) {
      throw new Error(`Failed to count documents: ${JSON.stringify(err)}`);
    }
  }

  /**
   * Finds a document by its ID.
   * @param id - Document ID
   * @returns The found document
   */
  public async findById(id: string): Promise<T> {
    try {
      return (await this.model.findById(id).exec()) as T;
    } catch (err) {
      throw new Error(`Failed to find document by ID: ${JSON.stringify(err)}`);
    }
  }

  /**
   * Creates a new document.
   * @param item - The document to create
   * @returns The created document
   */
  public async create(item: T): Promise<T> {
    try {
      item._id = undefined;
      item.updatedAt = new Date();
      return (await this.model.create(item)) as T;
    } catch (err) {
      throw new Error(`Failed to create document: ${JSON.stringify(err)}`);
    }
  }

  /**
   * Updates a document based on query.
   * @param query - MongoDB query object
   * @param item - The document to update
   * @returns The updated document
   */
  public async update(query: any, item: T): Promise<T | null> {
    try {
      item.updatedAt = new Date();
      return (await this.model
        .findOneAndUpdate(query, item, { new: true })
        .exec()) as T;
    } catch (err) {
      throw new Error(`Failed to update document: ${JSON.stringify(err)}`);
    }
  }

  /**
   * Removes a document by its ID.
   * @param id - Document ID
   * @returns The removed document
   */
  public async remove(id: string): Promise<T> {
    try {
      const document = (await this.model
        .findOneAndDelete({ _id: this.toObjectId(id) })
        .exec()) as T;
      if (!document) {
        throw new Error(`Document with id ${id} not found`);
      }
      return document;
    } catch (err) {
      throw new Error(`Failed to remove document: ${JSON.stringify(err)}`);
    }
  }

  /**
   * Converts a string ID to a MongoDB ObjectId.
   * @param id - String ID
   * @returns The ObjectId
   */
  public toObjectId(id: string): mongoose.Types.ObjectId {
    return new mongoose.Types.ObjectId(id);
  }

  /**
   * Runs an aggregation pipeline.
   * @param aggregates - The aggregation pipeline
   * @returns The result of the aggregation
   */
  public async aggregateRunner(aggregates: any[]): Promise<any[]> {
    try {
      return await this.model.aggregate(aggregates).exec();
    } catch (err) {
      throw new Error(`Failed to run aggregation: ${JSON.stringify(err)}`);
    }
  }

  /**
   * Counts the number of documents based on query.
   * @param query - MongoDB query object
   * @returns The count of documents
   */
  public async recordCount(query?: any): Promise<number> {
    try {
      return await this.model.countDocuments(query || {}).exec();
    } catch (err) {
      throw new Error(`Failed to count documents: ${JSON.stringify(err)}`);
    }
  }

  /**
   * Filters documents based on query, paging, and sorting criteria.
   * @param query - MongoDB query object
   * @param paging - Paging request object
   * @param sort - Sorting criteria
   * @returns The list of filtered documents
   */
  public async collectionFilter(
    query?: any,
    paging?: PagingRequest,
    sort?: any,
  ): Promise<T[]> {
    try {
      const aggregations: any = [];
      if (query) {
        aggregations.push({ $match: query });
      }
      if (sort) {
        aggregations.push({ $sort: sort });
      }
      if (paging && paging.skip >= 0) {
        aggregations.push({ $limit: paging.limit + paging.skip });
        aggregations.push({ $skip: paging.skip });
      }
      return (await this.model.aggregate(aggregations).exec()) as T[];
    } catch (err) {
      throw new Error(`Failed to filter collection: ${JSON.stringify(err)}`);
    }
  }
}
