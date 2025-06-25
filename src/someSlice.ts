import { createSlice } from "@reduxjs/toolkit";
import type { PaymentType } from "./api/getData";
import type { DebtType } from "./types/apiTypes";

interface SomeState {
  value: number;
  payment: PaymentType[];
  totalFinal: number;
  totalPendingAgent: number;
  totalPendingTreasury: number;
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
  value: 0,
  payment: [],
  totalFinal: 0,
  totalPendingAgent: 0,
  totalPendingTreasury: 0,
  Debt: [],
  totalDebt: 0,
  dueDateFinal: null,
};

// ✅ تابع تبدیل اعداد فارسی به انگلیسی
function convertPersianNumberToEnglish(str: string): string {
  const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[۰-۹]/g, (w) => String(persianNumbers.indexOf(w)));
}

// ✅ چک سال کبیسه
function isLeapYear(year: number): boolean {
  return ((year + 38) * 682) % 2816 < 682;
}

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

      state.totalFinal = action.payload
        .filter((p: PaymentType) => p.status === "4")
        .reduce((sum: number, p: PaymentType) => sum + Number(p.price || 0), 0);

      state.totalPendingAgent = action.payload
        .filter((p: PaymentType) => p.status === "0")
        .reduce((sum: number, p: PaymentType) => sum + Number(p.price || 0), 0);

      state.totalPendingTreasury = action.payload
        .filter((p: PaymentType) => p.status === "1")
        .reduce((sum: number, p: PaymentType) => sum + Number(p.price || 0), 0);
    },

    setDebt(state, action) {
      state.Debt = action.payload.length > 0 ? action.payload : fakeData;

      state.totalDebt = state.Debt.reduce(
        (sum: number, d: DebtType) => sum + Number(d.debt || 0),
        0
      );

      const debtsWithStatusZero = state.Debt.filter((d) => d.status === "0");

      if (debtsWithStatusZero.length > 0) {
        const minDebt = debtsWithStatusZero.reduce(
          (min, d) => (d.dayOfYear < min.dayOfYear ? d : min),
          debtsWithStatusZero[0]
        );

        const persianYear = parseInt(
          convertPersianNumberToEnglish(minDebt.debtDate.split("/")[0]),
          10
        );

        let dueDay = minDebt.dayOfYear + 45;
        let dueYear = persianYear;

        while (dueDay > (isLeapYear(dueYear) ? 366 : 365)) {
          dueDay -= isLeapYear(dueYear) ? 366 : 365;
          dueYear++;
        }

        state.dueDateFinal = { dayOfYear: dueDay, year: dueYear };
      } else {
        state.dueDateFinal = null;
      }
    },
    setDueDateFinal: (state, action) => {
      state.dueDateFinal = action.payload;
    },
  },
});

export const {
  increment,
  decrement,
  setValue,
  setPayments,
  setDebt,
  setDueDateFinal,
} = someSlice.actions;

export default someSlice.reducer;
