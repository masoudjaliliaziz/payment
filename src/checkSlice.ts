// checkSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PaymentType } from "./types/apiTypes";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CheckState {
  checks: PaymentType[];
  totalCheckAmount: number;
}

const initialState: CheckState = {
  checks: [],
  totalCheckAmount: 0,
};

const checkSlice = createSlice({
  name: "check",
  initialState,
  reducers: {
    setChecks: (state, action: PayloadAction<PaymentType[]>) => {
      state.checks = action.payload;
      state.totalCheckAmount = action.payload.reduce(
        (sum, check) => sum + Number(check.price || 0),
        0
      );
    },
  },
});

export const { setChecks } = checkSlice.actions;
export default checkSlice.reducer;
