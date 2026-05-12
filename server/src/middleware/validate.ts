import type { Request, Response, NextFunction } from 'express';
import type { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e: any) {
      if (e instanceof ZodError) {
        return res.status(400).json({
          status: 'error',
          errors: e.errors.map(err => ({ path: err.path, message: err.message }))
        });
      }
      return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  };