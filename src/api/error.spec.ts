import { describe, expect, it } from "vitest";
import { toApiErrorMessage } from "./error";

describe("toApiErrorMessage", () => {
  it("returns backend message from structured payload", () => {
    const message = toApiErrorMessage(
      {
        status: 400,
        data: {
          message: "selectedIndex must be between 0 and 3.",
        },
      },
      "fallback",
    );

    expect(message).toBe("selectedIndex must be between 0 and 3.");
  });

  it("joins validation details arrays", () => {
    const message = toApiErrorMessage(
      {
        status: 400,
        data: {
          message: ["limit must not be greater than 100", "difficulty must be valid"],
        },
      },
      "fallback",
    );

    expect(message).toContain("limit must not be greater than 100");
    expect(message).toContain("difficulty must be valid");
  });

  it("falls back to status text when no payload message exists", () => {
    const message = toApiErrorMessage(
      {
        status: 500,
        data: {},
      },
      "fallback",
    );

    expect(message).toBe("Request failed (500)");
  });

  it("falls back to provided default for unknown values", () => {
    const message = toApiErrorMessage(undefined, "fallback");
    expect(message).toBe("fallback");
  });
});