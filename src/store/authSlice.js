import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const payload = action.payload?.user ? action.payload : { user: action.payload };
      state.user = payload.user || payload;
      state.token = action.payload.token || localStorage.getItem("token");
      state.isAuthenticated = true;
      state.error = null;
      state.loading = false;
      localStorage.setItem("token", state.token || "");
      localStorage.setItem("authUser", JSON.stringify(payload));
    },
    loginError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
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

export const { loginSuccess, loginError, logout, setLoading, clearError } =
  authSlice.actions;
export default authSlice.reducer;
