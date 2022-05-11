import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import decode from "jwt-decode";
import { toast } from "react-toastify";

import { toCamelCase } from "utils/common";
import apiClient from "../../api-client";

export const login = createAsyncThunk(
  "auth/login",
  async (loginCredentials) => {
    try {
      const response = await apiClient.post("/auth/login", loginCredentials);
      return toCamelCase(response);
    } catch (err) {
      throw Error(err.error_message);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (registerInfo) => {
    try {
      const response = await apiClient.post("/auth/register", registerInfo);
      return toCamelCase(response);
    } catch (err) {
      throw Error(err.error_message);
    }
  }
);

export const getAuthUser = createAsyncThunk("auth/getUser", async () => {
  try {
    const response = await apiClient.get("/users/me");
    return toCamelCase(response);
  } catch (err) {
    throw Error(err.error_message);
  }
});

const initialState = {
  isLoggedIn: false,
  isLoading: false,
  user: null,
};

const isValidToken = (token) => {
  console.log("found", token);
  if (!token) return false;
  try {
    const decodedToken = decode(token);
    return !!decodedToken.iss;
  } catch (e) {
    return false;
  }
};

const token = localStorage.getItem("token");

if (isValidToken(token)) {
  initialState.isLoggedIn = true;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem("token");
      state.isLoggedIn = false;
      state.user = null;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    resetAuthState: (state) => {
      state.isLoggedIn = false;
      state.isLoading = false;
      state.user = null;
    },
  },
  extraReducers: {
    [login.fulfilled]: (state, action) => {
      localStorage.setItem("token", action.payload.accessToken);
      state.isLoggedIn = true;
    },
    [login.rejected]: (state, action) => {
      const error = action.error.message || "Unexpected Error!";
      toast.error(error);
    },
    [register.fulfilled]: (state, action) => {
      localStorage.setItem("token", action.payload.accessToken);
      state.isLoggedIn = true;
    },
    [register.rejected]: (state, action) => {
      const error = action.error.message || "Unexpected Error!";
      toast.error(error);
    },
    [getAuthUser.fulfilled]: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { logIn, logout, resetAuthState } = authSlice.actions;
export default authSlice;
