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
  dueDateFinal: { dayOfYear: number; year: number } | null;
}

const fakeData: DebtType[] = [
  {
    debt: "123456",
    debtDate: "۰۱/۰۲/۰۳",
    orderNum: "123456",
    parentGUID: "tttt",
    userName: "masoud",
    dayOfYear: 66,
    status: "0",
  },
  {
    debt: "123456",
    debtDate: "۰۱/۰۲/۰۳",
    orderNum: "123456",
    parentGUID: "tttt",
    userName: "masoud",
    dayOfYear: 61,
    status: "0",
  },
];

const initialState: SomeState = {
  payment: [],
  value: 0,
  totalFinal: 0,
  totalPendingAgent: 0,
  totalPendingTretury: 0,
  Debt: [],
  totalDebt: 0,
  dueDateFinal: null,
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
      if (action.payload.length <= 0) {
        console.log("hello motheFucke");
        state.Debt = fakeData;
      } else {
        state.Debt = action.payload;
      }

      const totalDebt = state.Debt.reduce(
        (sum: number, d: DebtType) => sum + Number(d.debt || 0),
        0
      );
      state.totalDebt = totalDebt;

      if (state.Debt.length > 0) {
        const minDay = Math.min(
          ...state.Debt.map((d: DebtType) => d.dayOfYear)
        );
        const dueDay = minDay + 45;
        const dueYear = 1404; // سال پایه (اگر نیاز داری این رو داینامیک بگیری، می‌تونی از API بخونی)

        // ❌ دیگه نیاز به چک کردن عبور از سال نداری
        // این کار رو تابع تبدیل تاریخ انجام می‌ده

        state.dueDateFinal = { dayOfYear: dueDay, year: dueYear };
      } else {
        state.dueDateFinal = null;
      }
    },
  },
});

export const { increment, decrement, setValue, setPayments, setDebt } =
  someSlice.actions;

export default someSlice.reducer;
