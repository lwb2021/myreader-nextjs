import * as types from "./types";
import { combineReducers } from "redux";
import { createWrapper } from "next-redux-wrapper";
import { configureStore } from "@reduxjs/toolkit";
import bookReducer from "./book/bookSlice";

// const rootReducer = combineReducers({
//   reducer: {
//     book: bookReducer,
//   },
// });

export const store = configureStore({
  reducer: {
    book: bookReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
