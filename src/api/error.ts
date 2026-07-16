import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readMessageFromData(data: unknown): string | undefined {
  if (!isRecord(data)) {
    return undefined;
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