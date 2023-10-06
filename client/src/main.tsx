import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "app/app";
import { Provider } from "react-redux";
import { store } from "app/store/store";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
