import { ThemeProvider } from "@mui/material";
import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { prepaiTheme } from "../../theme/prepai-theme";
import { MockExamRunnerPage } from "./mock-exam-runner";

const sampleExam = {
  id: 1,
  slug: "sample-mock-exam",
  body: "CSS",
  level: "Medium",
  title: "Sample Exam",
  questionsCount: 10,
  durationMinutes: 0,
  negativeMarking: 0.25,
};

describe("MockExamRunnerPage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("auto-submits when timer reaches zero", () => {
    const onSubmitRun = vi.fn();

    render(
      <ThemeProvider theme={prepaiTheme}>
        <MockExamRunnerPage exam={sampleExam} onSubmitRun={onSubmitRun} />
      </ThemeProvider>,
    );

    vi.advanceTimersByTime(1100);

    expect(onSubmitRun).toHaveBeenCalledTimes(1);
  });
});