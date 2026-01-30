import axios from "axios";
import { NewRecipe, Recipe } from "../types";
const baseUrl = "/api/recipes";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const getPublic = () => {
  return axios.get<Recipe[]>(baseUrl).then((res) => res.data);
};

const getMine = async () => {
  const response = await axios.get<Recipe[]>(`${baseUrl}/mine`, getAuthConfig());
  return response.data;
};

const getById = async (id: string) => {
  const response = await axios.get<Recipe>(`${baseUrl}/${id}`, getAuthConfig());
  return response.data;
};

const create = async (newRecipe: NewRecipe) => {
  const response = await axios.post<Recipe>(baseUrl, newRecipe, getAuthConfig());
  return response.data;
};

const update = async (id: string, recipeObj: Recipe) => {
  const response = await axios.put<Recipe>(`${baseUrl}/${id}`, recipeObj, getAuthConfig());
  return response.data;
};

const remove = async (id: string) => {
  await axios.delete(`${baseUrl}/${id}`, getAuthConfig());
};

export default { getPublic, getMine, getById, create, update, remove };
