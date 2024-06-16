import { injectable } from "inversify";
import * as mongoose from "mongoose";
import { IBaseModel } from "../persistence/schemas/IBaseModel";
import { IRepositoryBase } from "../../domain/interfaces/IRepositoryBase";
import { PagingRequest } from "../../domain/models/PagingRequest";
import { IPagedResponse } from "../../domain/models/IPagedResponse";

@injectable()
export abstract class RepositoryBase<T extends IBaseModel> implements IRepositoryBase<T>
{
  private model!: mongoose.Model<T>;

  set schema(schema: mongoose.Model<T>) {
    this.model = schema;
  }

  public async filter(
    query?: any,
    paging?: PagingRequest,
    sort?: any
  ): Promise<IPagedResponse<T>> {
    try {
      const [list, count] = await Promise.all([
        this.collectionFilter(query, paging, sort),
        this.count(query),
      ]);
      return { count, list };
    } catch (err) {
      throw new Error(JSON.stringify(err));
    }
  }

  public async findOne(query: any): Promise<T> {
    try {
      return (await this.model.findOne(query).exec()) as T;
    } catch (err) {
      throw new Error(JSON.stringify(err));
    }
  }

  public async find(query: any): Promise<T[]> {
    try {
      return (await this.model.find(query).exec()) as T[];
    } catch (err) {
      throw new Error(JSON.stringify(err));
    }
  }

  public async count(query: any): Promise<number> {
    try {
      return await this.model.countDocuments(query).exec();
    } catch (err) {
      throw new Error(JSON.stringify(err));
    }
  }

  public async findById(id: string): Promise<T> {
    try {
      return (await this.model.findById(id).exec()) as T;
    } catch (err) {
      throw new Error(JSON.stringify(err));
    }
  }

  public async create(item: T): Promise<T> {
    try {
      item._id = undefined;
      item.updatedAt = new Date();
      return (await this.model.create(item)) as T;
    } catch (err) {
      throw new Error(JSON.stringify(err));
    }
  }

  public async update(query: any, item: T): Promise<T | null> {
    try {
      item.updatedAt = new Date();
      return (await this.model
        .findOneAndUpdate(query, item, { new: true })
        .exec()) as T;
    } catch (err) {
      throw new Error(JSON.stringify(err));
    }
  }

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
      throw new Error(JSON.stringify(err));
    }
  }

  public toObjectId(id: string): mongoose.Types.ObjectId {
    return new mongoose.Types.ObjectId(id);
  }

  public async aggregateRunner(aggregates: any[]): Promise<any[]> {
    try {
      return await this.model.aggregate(aggregates).exec();
    } catch (err) {
      throw new Error(JSON.stringify(err));
    }
  }

  public async recordCount(query?: any): Promise<number> {
    try {
      return await this.model.countDocuments(query || {}).exec();
    } catch (err) {
      throw new Error(JSON.stringify(err));
    }
  }

  public async collectionFilter(
    query?: any,
    paging?: PagingRequest,
    sort?: any
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
      throw new Error(JSON.stringify(err));
    }
  }
}
