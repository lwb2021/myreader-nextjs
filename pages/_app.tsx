import "../styles/globals.css";
import "../styles/App.css";
import "../styles/spinner.css";
import "../styles/index.css";
import type { AppProps } from "next/app";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../store/store";
import { Provider } from "react-redux";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
