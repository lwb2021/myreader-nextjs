import { configureStore, combineReducers } from "@reduxjs/toolkit";
import bookReducer from "./book/bookSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";
import hardSet from "redux-persist/lib/stateReconciler/hardSet";
// TODO: why?
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
