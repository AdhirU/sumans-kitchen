import axios from "axios";
import { User } from "../types";

const baseUrl = "/api/auth";

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

const register = async (
  email: string,
  password: string,
  name: string
): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${baseUrl}/register`, {
    email,
    password,
    name,
  });
  return response.data;
};

const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${baseUrl}/login`, {
    email,
    password,
  });
  return response.data;
};

const googleLogin = async (credential: string): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${baseUrl}/google`, {
    credential,
  });
  return response.data;
};

const getCurrentUser = async (token: string): Promise<User> => {
  const response = await axios.get<User>(`${baseUrl}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export default { register, login, googleLogin, getCurrentUser };
