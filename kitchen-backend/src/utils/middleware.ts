import { NextFunction, Request, Response } from "express";
import { newRecipeSchema, recipeSchema } from "../types";
import { z } from "zod";

export const newRecipeParser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    newRecipeSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

export const recipeParser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    recipeSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

export const newRecipeErrorHandler = (
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
