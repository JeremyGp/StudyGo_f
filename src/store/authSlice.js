import { createSlice } from "@reduxjs/toolkit";

const usuarioGuardado = localStorage.getItem("authUser");
const tokenGuardado = localStorage.getItem("token");

const initialState = {
  user: usuarioGuardado ? JSON.parse(usuarioGuardado) : null,
  token: tokenGuardado || null,
  isAuthenticated: !!tokenGuardado,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { token, user } = action.payload;

      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.error = null;
      state.loading = false;

      localStorage.setItem("token", token);
      localStorage.setItem("authUser", JSON.stringify(user));

      if (action.payload.tokenType) {
        localStorage.setItem("tokenType", action.payload.tokenType);
      }
    },
    loginError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;

      localStorage.removeItem("token");
      localStorage.removeItem("tokenType");
      localStorage.removeItem("authUser");
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { loginSuccess, loginError, logout, setLoading, clearError } = authSlice.actions;
export default authSlice.reducer;
