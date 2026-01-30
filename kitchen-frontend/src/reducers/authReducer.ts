import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import authService, { AuthResponse } from "../services/auth";
import { AppDispatch } from "../store";
import { User } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setAuth(state, action: PayloadAction<AuthResponse>) {
      state.user = action.payload.user;
      state.token = action.payload.access_token;
      localStorage.setItem("token", action.payload.access_token);
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    clearAuth(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
});

export const { setLoading, setAuth, setUser, clearAuth } = authSlice.actions;

export const register = (email: string, password: string, name: string) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await authService.register(email, password, name);
      dispatch(setAuth(response));
      return true;
    } catch {
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const login = (email: string, password: string) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await authService.login(email, password);
      dispatch(setAuth(response));
      return true;
    } catch {
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const googleLogin = (credential: string) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await authService.googleLogin(credential);
      dispatch(setAuth(response));
      return true;
    } catch {
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const loadUser = () => {
  return async (dispatch: AppDispatch, getState: () => { auth: AuthState }) => {
    const { token } = getState().auth;
    if (!token) return;

    dispatch(setLoading(true));
    try {
      const user = await authService.getCurrentUser(token);
      dispatch(setUser(user));
    } catch {
      dispatch(clearAuth());
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const logout = () => {
  return (dispatch: AppDispatch) => {
    dispatch(clearAuth());
  };
};

export default authSlice.reducer;
