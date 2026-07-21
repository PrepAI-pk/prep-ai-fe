import { describe, expect, it } from "vitest";
import { isPlanRequiredError, toApiErrorMessage } from "./error";

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

  it("flattens Zod issues from the new backend error envelope", () => {
    const message = toApiErrorMessage(
      {
        status: 422,
        data: {
          statusCode: 422,
          code: "VALIDATION_FAILED",
          message: "Validation failed",
          details: {
            issues: [
              { path: ["email"], message: "Invalid email address" },
              { path: ["password"], message: "Too small: expected string to have >=8 characters" },
            ],
          },
        },
      },
      "fallback",
    );

    expect(message).toContain("Invalid email address");
    expect(message).toContain("Too small: expected string to have >=8 characters");
  });
});

describe("isPlanRequiredError", () => {
  it("is true for a 403 PLAN_REQUIRED envelope", () => {
    expect(
      isPlanRequiredError({
        status: 403,
        data: { code: "PLAN_REQUIRED", message: "This feature requires a higher plan." },
      }),
    ).toBe(true);
  });

  it("is false for a 403 with a different code", () => {
    expect(isPlanRequiredError({ status: 403, data: { code: "FORBIDDEN" } })).toBe(false);
  });

  it("is false for a non-403 error and for unknown values", () => {
    expect(isPlanRequiredError({ status: 404, data: { code: "PLAN_REQUIRED" } })).toBe(false);
    expect(isPlanRequiredError(undefined)).toBe(false);
  });
});