import type { PaymentType } from "./api/getData";
import { createSlice } from "@reduxjs/toolkit";
import type { DebtType } from "./types/apiTypes";

interface SomeState {
  value: number;
  payment: PaymentType[];
  totalFinal: number;
  totalPending: number;
  Debt: DebtType[];
  totalDebt: number;
}

const initialState: SomeState = {
  payment: [],
  value: 0,
  totalFinal: 0,
  totalPending: 0,
  Debt: [],
  totalDebt: 0,
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

      const totalFinal = action.payload
        .filter((p: PaymentType) => p.status === String(4))
        .reduce((sum: number, p: PaymentType) => sum + Number(p.price || 0), 0);

      const totalPending = action.payload
        .filter(
          (p: PaymentType) => p.status === String(0) || p.status === String(1)
        )
        .reduce((sum: number, p: PaymentType) => sum + Number(p.price || 0), 0);
      state.totalFinal = totalFinal;

      state.totalPending = totalPending;
    },
    setDebt(state, action) {
      state.Debt = action.payload;

      const totalDebt = action.payload.reduce(
        (sum: number, d: DebtType) => sum + Number(d.debt || 0),
        0
      );

      state.totalDebt = totalDebt;
    },
  },
});

export const { increment, decrement, setValue, setPayments, setDebt } =
  someSlice.actions;

export default someSlice.reducer;
