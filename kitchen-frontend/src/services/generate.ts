import axios from "axios";
import { NewRecipe } from "../types";

const baseUrl = "/api/generate";

const fromPrompt = async (promptText: string) => {
  const res = await axios.post<NewRecipe>(`${baseUrl}/from-prompt`, {
    promptText,
  });
  return res.data;
};

export default { fromPrompt };
