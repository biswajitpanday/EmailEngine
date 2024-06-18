import Joi from 'joi';

export const baseValidationSchema = Joi.object({
  _id: Joi.string()
    .optional()
    .regex(/^[0-9a-fA-F]{24}$/)
    .label('ID'), // MongoDB ObjectID validation
  createdAt: Joi.date().optional().label('Creation Date'),
  updatedAt: Joi.date().optional().label('Update Date'),
});
