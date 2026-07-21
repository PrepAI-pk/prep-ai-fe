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

const sampleSubjects = [
  { id: "s1", slug: "pak-constitution", name: "Pak Constitution", colorTint: null, order: 0 },
];

const sampleNextQuestion = {
  id: "q1",
  subject: { name: "Pak Constitution" },
  difficulty: "MEDIUM",
  questionText: "Which article defines Objectives Resolution principles?",
  options: ["Article 2", "Article 2A", "Article 25", "Article 62"],
  isBookmarked: false,
  usage: { answeredToday: 0, dailyLimit: 20, resetsAt: "2026-01-02T00:00:00.000Z" },
};

const sampleAnswerResponse = {
  isCorrect: true,
  correctIndex: 1,
  explanation: "Article 2A incorporates Objectives Resolution.",
  provenance: null,
  xpEarned: 5,
  streak: { current: 1, extendedToday: true },
  subjectStat: { subjectId: "s1", acc: 100, attempted: 1 },
};

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

    if (url.includes("/subjects") && method === "GET") {
      return new Response(JSON.stringify(sampleSubjects), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (url.includes("/practice/next") && method === "GET") {
      return new Response(JSON.stringify(sampleNextQuestion), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (url.includes("/practice/answer") && method === "POST") {
      return new Response(JSON.stringify(sampleAnswerResponse), {
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

  it("reveals answer flow and does not refetch the question on check", async () => {
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

    const nextCalls = fetchMock.mock.calls.filter((call) =>
      extractUrl(call[0] as RequestInfo | URL).includes("/practice/next"),
    );
    const answerCalls = fetchMock.mock.calls.filter((call) =>
      extractUrl(call[0] as RequestInfo | URL).includes("/practice/answer"),
    );

    expect(nextCalls.length).toBe(1);
    expect(answerCalls.length).toBe(1);
  }, 15000);
});
