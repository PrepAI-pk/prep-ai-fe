import "./instrument"; // Must be first — see instrument.ts

import * as Sentry from "@sentry/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.tsx";
import { DynamicThemeApp } from "./app/dynamic-theme-app.tsx";
import { store } from "./store/store";
import "./index.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<p>Something went wrong. Please refresh the page.</p>}>
      <Provider store={store}>
        <DynamicThemeApp>
          <App />
        </DynamicThemeApp>
      </Provider>
    </Sentry.ErrorBoundary>
  </StrictMode>,
)
