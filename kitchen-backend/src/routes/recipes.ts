import express, { Request, Response } from "express";
import recipeService from "../services/recipeService";
import middleware from "../utils/middleware";
import { NewRecipe, Recipe } from "../types";

const router = express.Router();

router.get("/", (_req, res: Response<Recipe[]>) => {
  res.send(recipeService.getAll());
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const recipe = recipeService.findById(id);
  if (!recipe) {
    res.status(404).end();
    return;
  }
  res.send(recipe);
});

router.post(
  "/",
  middleware.newRecipeParser,
  (req: Request<unknown, unknown, NewRecipe>, res: Response<Recipe>) => {
    const addedRecipe = recipeService.addRecipe(req.body);
    res.send(addedRecipe);
  }
);

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  recipeService.deleteById(id);

  res.status(204).end();
});

router.use(middleware.newRecipeErrorHandler);

export default router;
