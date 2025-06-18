import { createSlice } from "@reduxjs/toolkit";

interface SomeState {
  value: number;
}

const initialState: SomeState = {
  value: 0,
};

const someSlice = createSlice({
  name: "someFeature",
  initialState,
  reducers: {
    increment(state) {
      state.value += 1;
    },
    decrement(state) {
      state.value -= 1;
    },
    setValue(state, action) {
      state.value = action.payload;
    },
  },
});

export const { increment, decrement, setValue } = someSlice.actions;
export default someSlice.reducer;
