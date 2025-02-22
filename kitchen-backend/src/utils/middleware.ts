import { NextFunction, Request, Response } from "express";
import { newRecipeSchema } from "./zodSchemas";
import { z } from "zod";

const newRecipeParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    newRecipeSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const newRecipeErrorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

export default { newRecipeParser, newRecipeErrorHandler };
