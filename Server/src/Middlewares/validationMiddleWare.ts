import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from '../types/error';

const validate =
  (schema: { body?: AnyZodObject; query?: AnyZodObject; params?: AnyZodObject }) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) await schema.body.parseAsync(req.body);
      if (schema.query) await schema.query.parseAsync(req.query);
      if (schema.params) await schema.params.parseAsync(req.params);

      next();
    } catch (error) {
      console.log('Error ', error);
      if (error instanceof ZodError) {
        throw new AppError(
          'Validation Failed',
          400,
          error.errors.map((err) => ({
            message: err.message,
          }))
        );
      }

      next(error);
    }
  };

export default validate;
