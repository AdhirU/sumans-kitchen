import axios from "axios";
const baseUrl = "/api/recipes";

let token: string | null = null;

const setToken = (newToken: string) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  return axios.get(baseUrl).then((res) => res.data);
};

const create = async (newObject: object) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const update = async (id: string, newObject: object) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject);
  return response.data;
};

export default { getAll, create, update, setToken };
