import { Types } from "mongoose";

/**
 * Interface representing the base model properties.
 */
export interface IBaseModel {
  /**
   * Unique identifier for the model.
   */
  _id?: Types.ObjectId;

  /**
   * Timestamp when the document was created.
   */
  createdAt?: Date;

  /**
   * Timestamp when the document was last updated.
   */
  updatedAt?: Date;
}
