import { configureStore } from "@reduxjs/toolkit";
import someReducer from "./someSlice";
import checkReducer from "./checkSlice"; // جدید
export const store = configureStore({
  reducer: {
    someFeature: someReducer,
    check: checkReducer,
  },
});


export type RootState = ReturnType<typeof store.getState>;


export type AppDispatch = typeof store.dispatch;
