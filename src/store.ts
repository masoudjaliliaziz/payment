import { configureStore } from "@reduxjs/toolkit";
import someReducer from "./someSlice";
import checkReducer from "./checkSlice"; // جدید
export const store = configureStore({
  reducer: {
    someFeature: someReducer,
    check: checkReducer,
  },
});

// تایپ ریشه‌ی state برنامه
export type RootState = ReturnType<typeof store.getState>;

// تایپ Dispatch برنامه
export type AppDispatch = typeof store.dispatch;
