import { API_BASE_URL } from "../../config/api";
import type { PipelineSnapshot } from "./admin.types";

// EventSource can't send a custom Authorization header, so — same as
// tutor.stream.ts — this reads the SSE body via fetch() directly rather than
// the browser's native EventSource.
export async function streamAdminPipeline(
  documentId: string,
  accessToken: string | null,
  onSnapshot: (snapshot: PipelineSnapshot) => void,
): Promise<void> {
  let response: globalThis.Response;
  try {
    response = await fetch(`${API_BASE_URL}/admin/documents/${documentId}/pipeline/stream`, {
      credentials: "include",
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });
  } catch {
    return;
  }

  if (!response.ok || !response.body) {
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    buffer += decoder.decode(value, { stream: true });

    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";

    for (const part of parts) {
      const dataLines = part
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trim());
      if (dataLines.length === 0) {
        continue;
      }
      try {
        onSnapshot(JSON.parse(dataLines.join("\n")) as PipelineSnapshot);
      } catch {
        // Ignore a malformed frame — the next one will resync.
      }
    }
  }
}
