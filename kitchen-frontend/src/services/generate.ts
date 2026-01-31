import axios from "axios";
import { NewRecipe } from "../types";

const baseUrl = "/api/generate";

const fromPrompt = async (promptText: string) => {
  const res = await axios.post<NewRecipe>(`${baseUrl}/from-prompt`, {
    promptText,
  });
  return res.data;
};

const fromImage = async (imageFile: File) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  const res = await axios.post<NewRecipe>(`${baseUrl}/from-image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export default { fromPrompt, fromImage };
