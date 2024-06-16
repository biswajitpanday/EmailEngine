
import { IsOptional } from 'class-validator';
import { IBaseModel } from '../../infrastructure/persistence/schemas/IBaseModel';

export abstract class BaseModel implements IBaseModel {
  @IsOptional()
  _id?: any;
  @IsOptional()
  createdAt?: Date;
  @IsOptional()
  updatedAt?: Date = new Date();
}
