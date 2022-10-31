import { configureStore, combineReducers } from "@reduxjs/toolkit";
import bookReducer from "./book/bookSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";
import hardSet from "redux-persist/lib/stateReconciler/hardSet";
// src: https://stackoverflow.com/a/73786120/12184991
import * as reduxThunk from "redux-thunk/extend-redux";

const rootReducer = combineReducers({
  book: bookReducer,
});

const persistConfig = {
  key: "root",
  storage,
  stateReconciler: hardSet,
};

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(
  persistConfig,
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);

// extract its ReturnType
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
