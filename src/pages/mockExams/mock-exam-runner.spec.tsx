import { ThemeProvider } from "@mui/material";
import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { prepaiApi } from "../../api/baseApi";
import { authReducer } from "../../store/slices/auth-slice";
import { prepaiTheme } from "../../theme/prepai-theme";
import { MockExamRunnerPage } from "./mock-exam-runner";

// PracticeTopbar (rendered inside MockExamRunnerPage) reads theme/notification
// preferences via RTK Query now, so it needs a real Provider — a plain
// ThemeProvider was enough before that wiring existed.
function renderWithProviders(children: React.ReactNode) {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      [prepaiApi.reducerPath]: prepaiApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(prepaiApi.middleware),
  });

  return render(
    <Provider store={store}>
      <ThemeProvider theme={prepaiTheme}>{children}</ThemeProvider>
    </Provider>,
  );
}

const FIXED_NOW = new Date("2026-07-18T10:00:00.000Z").getTime();
const ATTEMPT_ID = "attempt-1";

function sampleAttempt(expiresAt: string) {
  return {
    attemptId: ATTEMPT_ID,
    exam: { id: "e1", name: "Sample Exam", durationMins: 1, negativeMark: 0.25, totalQuestions: 1 },
    state: "IN_PROGRESS",
    expiresAt,
    questions: [
      {
        order: 1,
        id: "q1",
        subject: { name: "General Knowledge" },
        questionText: "Sample question?",
        options: ["A", "B", "C", "D"],
        selectedIndex: null,
        flagged: false,
      },
    ],
  };
}

function setupMockFetch(expiresAt: string, onSubmitRequested: () => void) {
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    const method =
      init?.method ?? (typeof input === "string" || input instanceof URL ? "GET" : input.method);

    if (url.includes(`/exam-attempts/${ATTEMPT_ID}/submit`) && method === "POST") {
      onSubmitRequested();
      return new Response(JSON.stringify({ attemptId: ATTEMPT_ID }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (url.includes(`/exam-attempts/${ATTEMPT_ID}`) && method === "GET") {
      return new Response(JSON.stringify(sampleAttempt(expiresAt)), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: `Unhandled URL: ${url}` }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  });

  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("MockExamRunnerPage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("auto-submits once the server-issued expiresAt has passed", async () => {
    let submitRequested = false;
    const expiresAt = new Date(FIXED_NOW + 500).toISOString();
    setupMockFetch(expiresAt, () => {
      submitRequested = true;
    });
    const onSubmitted = vi.fn();

    renderWithProviders(<MockExamRunnerPage attemptId={ATTEMPT_ID} onSubmitted={onSubmitted} />);

    // Let the initial GET /exam-attempts/:id resolve and the 1s ticker mount.
    await vi.advanceTimersByTimeAsync(0);
    // Cross the 500ms expiresAt boundary at the next 1s tick.
    await vi.advanceTimersByTimeAsync(1100);

    expect(submitRequested).toBe(true);
    expect(onSubmitted).toHaveBeenCalledWith(ATTEMPT_ID);
  });
});
