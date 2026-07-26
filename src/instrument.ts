// Imported first in main.tsx. An unset VITE_SENTRY_DSN makes this a silent
// no-op (Sentry's SDK doesn't throw on a missing DSN), so this is safe in
// every environment, local dev included.
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
});
