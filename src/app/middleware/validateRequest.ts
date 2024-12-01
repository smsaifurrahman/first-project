import { NextFunction, Response, Request } from "express";
import { AnyZodObject } from "zod";


const validateRequest = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      // data validation using Zod
      try {
        await schema.parseAsync({
          body: req.body,
        });
        next();
      } catch (err) {
        next(err);
      }
    };
  };

  export default validateRequest;