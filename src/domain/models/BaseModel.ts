import { IBaseModel } from '../../infrastructure/persistence/schemas/IBaseModel';
import { Expose } from 'class-transformer';

/**
 * Base model class implementing common model properties
 */
export abstract class BaseModel implements IBaseModel {
  @Expose()
  _id?: any;

  @Expose()
  createdAt?: Date;

  @Expose()
  updatedAt?: Date = new Date();

  constructor() {
    if (!this.createdAt) {
      this.createdAt = new Date();
    }
  }
}
