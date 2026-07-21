import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Zod's issue shape from nestjs-zod's ZodValidationPipe, e.g.
// { code: "VALIDATION_FAILED", message: "Validation failed",
//   details: { issues: [{ path: ["email"], message: "Invalid email address" }] } }
function readIssuesMessage(details: unknown): string | undefined {
  if (!isRecord(details)) {
    return undefined;
  }

  const issues = details.issues;
  if (!Array.isArray(issues)) {
    return undefined;
  }

  const flattened = issues
    .map((issue) => (isRecord(issue) && typeof issue.message === "string" ? issue.message : undefined))
    .filter((message): message is string => Boolean(message))
    .join("; ");

  return flattened.trim().length > 0 ? flattened : undefined;
}

function readMessageFromData(data: unknown): string | undefined {
  if (!isRecord(data)) {
    return undefined;
  }

  // Zod's per-field issues are more useful than the generic top-level
  // "Validation failed" message that always accompanies them, so they take
  // priority when present.
  const fromIssues = readIssuesMessage(data.details);
  if (fromIssues) {
    return fromIssues;
  }

  const message = data.message;

  if (typeof message === "string" && message.trim().length > 0) {
    return message;
  }

  if (Array.isArray(message)) {
    const flattened = message.filter((item) => typeof item === "string").join("; ");
    if (flattened.trim().length > 0) {
      return flattened;
    }
  }

  const details = data.details;
  if (Array.isArray(details)) {
    const flattened = details.filter((item) => typeof item === "string").join("; ");
    if (flattened.trim().length > 0) {
      return flattened;
    }
  }

  return undefined;
}

// True for a 403 PLAN_REQUIRED response (API.md §1) — lets a screen render a
// paywall/upsell card instead of a generic error banner.
export function isPlanRequiredError(error: unknown): boolean {
  const fetchError = error as FetchBaseQueryError;
  if (typeof fetchError !== "object" || fetchError === null || !("status" in fetchError)) {
    return false;
  }
  if (fetchError.status !== 403) {
    return false;
  }
  return isRecord(fetchError.data) && fetchError.data.code === "PLAN_REQUIRED";
}

export function toApiErrorMessage(error: unknown, fallback: string): string {
  if (!error) {
    return fallback;
  }

  const fetchError = error as FetchBaseQueryError;
  if (typeof fetchError === "object" && fetchError !== null && "status" in fetchError) {
    if ("error" in fetchError && typeof fetchError.error === "string") {
      return fetchError.error;
    }

    const fromData = readMessageFromData(fetchError.data);
    if (fromData) {
      return fromData;
    }

    if (typeof fetchError.status === "number") {
      return `Request failed (${fetchError.status})`;
    }
  }

  const serialized = error as SerializedError;
  if (typeof serialized?.message === "string" && serialized.message.trim().length > 0) {
    return serialized.message;
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallback;
}