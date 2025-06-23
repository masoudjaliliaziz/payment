import type { PaymentType } from "./api/getData";
import { createSlice } from "@reduxjs/toolkit";
import type { DebtType } from "./types/apiTypes";

interface SomeState {
  value: number;
  payment: PaymentType[];
  totalFinal: number;
  totalPendingAgent: number;
  totalPendingTretury: number;
  Debt: DebtType[];
  totalDebt: number;
  dueDateFinal: number;
}

const initialState: SomeState = {
  payment: [],
  value: 0,
  totalFinal: 0,
  totalPendingAgent: 0,
  totalPendingTretury: 0,
  Debt: [],
  totalDebt: 0,
  dueDateFinal: 0,
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

      const totalPendingAgent = action.payload
        .filter((p: PaymentType) => p.status === String(0))
        .reduce((sum: number, p: PaymentType) => sum + Number(p.price || 0), 0);

      const totalPendingTretury = action.payload
        .filter((p: PaymentType) => p.status === String(1))
        .reduce((sum: number, p: PaymentType) => sum + Number(p.price || 0), 0);
      state.totalFinal = totalFinal;

      state.totalPendingAgent = totalPendingAgent;
      state.totalPendingTretury = totalPendingTretury;
    },
    setDebt(state, action) {
      state.Debt = action.payload;

      const totalDebt = action.payload.reduce(
        (sum: number, d: DebtType) => sum + Number(d.debt || 0),
        0
      );
      const dueDateFinal = action.payload.reduce(
        (sum: number, d: DebtType) =>
          sum +
          Number(d.debtDate.split("/")["2"] || 0) *
            Number(d.debtDate.split("/")["1"] || 0),
        0
      );
      state.dueDateFinal = dueDateFinal;
      state.totalDebt = totalDebt;
    },
  },
});

export const { increment, decrement, setValue, setPayments, setDebt } =
  someSlice.actions;

export default someSlice.reducer;
