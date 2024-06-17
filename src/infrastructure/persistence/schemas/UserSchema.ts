import { Schema, model, Document, Model, Types } from "mongoose";
import Joi from "joi";
import { IBaseModel } from "./IBaseModel";
import { baseValidationSchema } from "../validations/BaseValidationSchema";

// Define the IUser interface extending Document and IBaseModel
interface IUser extends IBaseModel {
  email: string;
  password: string;
  outlookToken?: string;
}

interface IUserDocument extends IUser, Document<Types.ObjectId> {}

// Define the Joi validation schema
const userValidationSchema = baseValidationSchema.concat(
  Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("Email Address"),
    password: Joi.string().min(4).required().label("Password"),
    outlookToken: Joi.string().optional().allow(null).label("Outlook Token"),
  })
);

// Define the user schema
const userSchema = new Schema<IUserDocument>(
  {
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    outlookToken: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook for validation
userSchema.pre<IUserDocument>("save", function (next) {
  const userObject = this.toObject();
  delete userObject._id; // Remove _id before validation
  const { error } = userValidationSchema.validate(userObject);
  if (error) {
    return next(new Error(error.details.map((x) => x.message).join(", ")));
  }
  next();
});

// Ensure unique email index
userSchema.index({ email: 1 }, { unique: true });

const UserSchema: Model<IUserDocument> = model<IUserDocument>(
  "User",
  userSchema
);

export { UserSchema, IUserDocument };
