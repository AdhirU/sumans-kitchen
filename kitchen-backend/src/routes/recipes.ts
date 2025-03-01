import express, { Request, Response } from "express";
import recipeService from "../services/recipeService";
import {
  newRecipeParser,
  recipeParser,
  newRecipeErrorHandler,
} from "../utils/middleware";
import { NewRecipe, Recipe } from "../types";

const router = express.Router();

router.get("/", (_req, res: Response<Recipe[]>) => {
  res.send(recipeService.getAll());
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  const recipe = recipeService.findById(id);
  if (!recipe) {
    res.status(404).end();
    return;
  }
  res.send(recipe);
});

router.post(
  "/",
  newRecipeParser,
  (req: Request<unknown, unknown, NewRecipe>, res: Response<Recipe>) => {
    const addedRecipe = recipeService.addRecipe(req.body);
    res.status(201).send(addedRecipe);
  }
);

router.put(
  "/:id",
  recipeParser,
  (req: Request<{ id: string }, unknown, Recipe>, res: Response<Recipe>) => {
    const id = req.params.id;
    const updatedRecipe = recipeService.updateRecipe(id, req.body);
    res.send(updatedRecipe);
  }
);

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  recipeService.deleteById(id);

  res.status(204).end();
});

router.use(newRecipeErrorHandler);

export default router;
