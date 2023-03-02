import { configureStore } from '@reduxjs/toolkit';
import calculatorSlice from "../features/calculator/calculatorSlice";

export const store = configureStore({
  reducer: calculatorSlice.reducer
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
