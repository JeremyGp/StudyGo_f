import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  horarios: [],
  loading: false,
  error: null,
};

const horariosSlice = createSlice({
  name: "horarios",
  initialState,
  reducers: {
    setHorarios: (state, action) => {
      state.horarios = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setHorarios, setLoading, setError } = horariosSlice.actions;
export default horariosSlice.reducer;
