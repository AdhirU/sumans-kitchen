import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { newRecipeSchema } from "../types";
const openai = new OpenAI();

const recipeFromPrompt = async (prompt: string) => {
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Generate a recipe based on the prompt provided. The recipe should have a title, a brief description, a list of ingredients required, and a list of directions to follow",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: zodResponseFormat(newRecipeSchema, "recipe"),
  });

  return completion.choices[0].message.parsed;
};

export default { recipeFromPrompt };
