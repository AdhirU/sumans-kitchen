import express, { Response } from "express";
import generateService from "../services/generateService";
import { z } from "zod";

const router = express.Router();

export const requestPromptSchema = z.object({
  prompt: z.string(),
});

router.post("/from-prompt", async (req, res: Response) => {
  const prompt = requestPromptSchema.parse(req.body).prompt;
  const recipe = await generateService.recipeFromPrompt(prompt);
  if (!recipe) {
    res
      .status(400)
      .send({ error: "Could not generate recipe from this prompt" });
    return;
  }
  res.send(recipe);
});

export default router;
