import express, { NextFunction, Request, Response } from "express";
import recipeService from "../services/recipeService";
import {
  newRecipeParser,
  recipeParser,
  recipeErrorHandler,
} from "../utils/middleware";
import { INewRecipe, IRecipe } from "../types";

const router = express.Router();

router.get("/", async (_req, res: Response<IRecipe[]>) => {
  const recipes = await recipeService.getAll();
  res.send(recipes);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const recipe = await recipeService.findById(id);
  if (!recipe) {
    res.status(404).end();
    return;
  }
  res.send(recipe);
});

router.post(
  "/",
  newRecipeParser,
  async (
    req: Request<unknown, unknown, INewRecipe>,
    res: Response<IRecipe>
  ) => {
    const addedRecipe = await recipeService.addRecipe(req.body);
    res.status(201).send(addedRecipe);
  }
);

router.put(
  "/:id",
  recipeParser,
  async (
    req: Request<{ id: string }, unknown, IRecipe>,
    res: Response<IRecipe | null>,
    next: NextFunction
  ) => {
    const id = req.params.id;
    try {
      const updatedRecipe = await recipeService.updateRecipe(id, req.body);
      res.send(updatedRecipe);
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await recipeService.deleteById(id);

  res.status(204).end();
});

router.use(recipeErrorHandler);

export default router;
