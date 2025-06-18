import type { PaymentType } from "./api/getData";
import { createSlice } from "@reduxjs/toolkit";

interface SomeState {
  value: number;
  payment: PaymentType[];
  totalPaidPrice: number;
}

const initialState: SomeState = {
  payment: [],
  value: 0,
  totalPaidPrice: 0,
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
    setPayments(state, action) {
      state.payment = action.payload;

      const total = action.payload
        .filter((p: PaymentType) => p.status === String(1))
        .reduce((sum: number, p: PaymentType) => sum + Number(p.price || 0), 0);

      state.totalPaidPrice = total;
    },
  },
});

export const { increment, decrement, setValue, setPayments } =
  someSlice.actions;

export default someSlice.reducer;
