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

  debtBaseDayOfYear: number | null;
  paymentBaseDayOfYear: number | null;
  debtPaymentDayDiff: number | null;
  dayDiff?: number;
  price: number | "";
  rawPrice: number | "";
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
  debtBaseDayOfYear: null,
  paymentBaseDayOfYear: null,
  debtPaymentDayDiff: null,
  price: "",
  rawPrice: "",
};

// ✅ تابع تبدیل اعداد فارسی به انگلیسی
function convertPersianNumberToEnglish(str: string): string {
  const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[۰-۹]/g, (w) => String(persianNumbers.indexOf(w)));
}

// ✅ چک سال کبیسه

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

      const paymentsWithStatusFour = action.payload.filter(
        (p: PaymentType) => p.status === "4"
      );

      if (paymentsWithStatusFour.length > 0) {
        const totalPaymentAmount = paymentsWithStatusFour.reduce(
          (sum: number, p: PaymentType) => sum + Number(p.price || 0),
          0
        );

        const weightedPaymentSum = paymentsWithStatusFour.reduce(
          (sum: number, p: PaymentType) =>
            sum + Number(p.price || 0) * Number(p.dayOfYear || 0),
          0
        );

        const avgPaymentDayOfYear = weightedPaymentSum / totalPaymentAmount;

        state.paymentBaseDayOfYear = Math.round(avgPaymentDayOfYear);
      } else {
        state.paymentBaseDayOfYear = null;
      }

      if (
        state.debtBaseDayOfYear != null &&
        state.paymentBaseDayOfYear != null
      ) {
        state.debtPaymentDayDiff =
          state.debtBaseDayOfYear - state.paymentBaseDayOfYear;
      } else {
        state.debtPaymentDayDiff = null;
      }

      // ✅ اختلاف هر پرداخت با تاریخ سررسید بدهی
      if (state.debtBaseDayOfYear != null) {
        state.payment = state.payment.map((p: PaymentType) => ({
          ...p,
          dayDiff: Number(p.dayOfYear || 0) - state.debtBaseDayOfYear!,
        }));
      }
    },
    setDebt(state, action) {
      state.Debt = action.payload.length > 0 ? action.payload : fakeData;

      const debtsWithStatusZero = state.Debt.filter(
        (d) => d.status === "0"
      ).sort((a, b) => a.dayOfYear - b.dayOfYear); // صعودی

      state.totalDebt = debtsWithStatusZero.reduce(
        (sum, d) => sum + Number(d.debt || 0),
        0
      );

      let remainingPayment = state.totalFinal;

      let unpaidDebt: DebtType | null = null;

      for (const debt of debtsWithStatusZero) {
        const debtAmount = Number(debt.debt || 0);
        if (remainingPayment >= debtAmount) {
          remainingPayment -= debtAmount;
        } else {
          unpaidDebt = debt;
          break;
        }
      }

      if (unpaidDebt) {
        const persianYear = parseInt(
          convertPersianNumberToEnglish(unpaidDebt.debtDate.split("/")[0]),
          10
        );

        state.dueDateFinal = {
          dayOfYear: unpaidDebt.dayOfYear,
          year: persianYear,
        };
        state.debtBaseDayOfYear = unpaidDebt.dayOfYear;
      } else if (debtsWithStatusZero.length > 0) {
        // در صورتی که همه بدهی‌ها تسویه شدن، راس آخرین بدهی رو بگیر
        const lastDebt = debtsWithStatusZero[debtsWithStatusZero.length - 1];

        const persianYear = parseInt(
          convertPersianNumberToEnglish(lastDebt.debtDate.split("/")[0]),
          10
        );

        state.dueDateFinal = {
          dayOfYear: lastDebt.dayOfYear,
          year: persianYear,
        };
        state.debtBaseDayOfYear = lastDebt.dayOfYear;
      } else {
        state.dueDateFinal = null;
        state.debtBaseDayOfYear = null;
        state.totalDebt = 0;
      }
    },
    setDueDateFinal: (state, action) => {
      state.dueDateFinal = action.payload;
    },
    setPrice: (state, action) => {
      state.rawPrice = action.payload; // مقدار خام
      state.price = action.payload; // همین رو نگه می‌داریم و هنگام نمایش فرمت می‌کنیم
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
  setPrice,
} = someSlice.actions;

export default someSlice.reducer;
