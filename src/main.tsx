import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.tsx";
import { DynamicThemeApp } from "./app/dynamic-theme-app.tsx";
import { store } from "./store/store";
import "./index.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <DynamicThemeApp>
        <App />
      </DynamicThemeApp>
    </Provider>
  </StrictMode>,
)
