import axios from "axios";
import { NewRecipe, Recipe } from "../types";
const baseUrl = "/api/recipes";

let token: string | null = null;

const setToken = (newToken: string) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  return axios.get<Recipe[]>(baseUrl).then((res) => res.data);
};

const create = async (newRecipe: NewRecipe) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post<Recipe>(baseUrl, newRecipe, config);
  return response.data;
};

const update = async (id: string, recipeObj: Recipe) => {
  const response = await axios.put<Recipe>(`${baseUrl}/${id}`, recipeObj);
  return response.data;
};

export default { getAll, create, update, setToken };
