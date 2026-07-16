import { CssBaseline, ThemeProvider } from "@mui/material";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { prepaiApi } from "../../api/baseApi";
import { practiceUiReducer } from "../../store/slices/practice-Ui-slice";
import { prepaiTheme } from "../../theme/prepai-theme";
import { PracticePage } from "./practice";

const sampleQuestions = [
  {
    id: 1,
    subject: "CSS",
    difficulty: "Medium",
    questionText: "Which article defines Objectives Resolution principles?",
    options: ["Article 2", "Article 2A", "Article 25", "Article 62"],
    explanation: "Article 2A incorporates Objectives Resolution.",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

function setupMockFetch() {
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;
    const method =
      init?.method ??
      (typeof input === "string" || input instanceof URL ? "GET" : input.method);

    if (url.includes("/questions?")) {
      return new Response(JSON.stringify(sampleQuestions), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (url.includes("/questions/1/check") && method === "POST") {
      return new Response(
        JSON.stringify({
          questionId: 1,
          selectedIndex: 1,
          isCorrect: true,
          explanation: "Article 2A incorporates Objectives Resolution.",
          correctIndex: 1,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify({ message: `Unhandled URL: ${url}` }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  });

  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function renderPracticePage() {
  const store = configureStore({
    reducer: {
      practiceUi: practiceUiReducer,
      [prepaiApi.reducerPath]: prepaiApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(prepaiApi.middleware),
  });

  return render(
    <Provider store={store}>
      <ThemeProvider theme={prepaiTheme}>
        <CssBaseline />
        <PracticePage />
      </ThemeProvider>
    </Provider>,
  );
}

describe("PracticePage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("reveals answer flow and does not refetch questions on check", async () => {
    const fetchMock = setupMockFetch();
    const user = userEvent.setup();

    renderPracticePage();

    expect(
      await screen.findByText(
        "Which article defines Objectives Resolution principles?",
      ),
    ).toBeTruthy();

    const optionB = await screen.findByRole("button", {
      name: "Option B: Article 2A",
    });
    await user.click(optionB);

    expect(await screen.findByText("Correct answer")).toBeTruthy();

    const nextQuestionButton = screen.getByRole("button", {
      name: /Next question/i,
    }) as HTMLButtonElement;
    expect(nextQuestionButton.disabled).toBe(false);

    const extractUrl = (input: RequestInfo | URL): string =>
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;

    const questionCalls = fetchMock.mock.calls.filter((call) =>
      extractUrl(call[0] as RequestInfo | URL).includes("/questions?"),
    );
    const checkCalls = fetchMock.mock.calls.filter((call) =>
      extractUrl(call[0] as RequestInfo | URL).includes("/questions/1/check"),
    );

    expect(questionCalls.length).toBe(1);
    expect(checkCalls.length).toBe(1);
  }, 15000);
});