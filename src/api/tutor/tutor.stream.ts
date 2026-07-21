import { API_BASE_URL } from "../../config/api";
import type { TutorCitation } from "./tutor.types";

export type TutorStreamHandlers = {
  onToken: (text: string) => void;
  onCitations: (citations: TutorCitation[]) => void;
  onDone: (info: { messageId: string; tokensIn: number | null; tokensOut: number | null }) => void;
  onError: (message: string, code?: string) => void;
};

type SseFrame = { event: string; data: string };

// RTK Query's fetchBaseQuery resolves once with a full response — it can't
// hand back progressively-arriving SSE frames, so the streaming call to
// POST /tutor/conversations/:id/messages (API.md §8) goes through fetch()
// directly instead of the shared prepaiApi.
function parseFrames(buffer: string): { frames: SseFrame[]; rest: string } {
  const parts = buffer.split("\n\n");
  const rest = parts.pop() ?? "";
  const frames: SseFrame[] = [];

  for (const part of parts) {
    let event = "message";
    const dataLines: string[] = [];
    for (const line of part.split("\n")) {
      if (line.startsWith("event:")) {
        event = line.slice(6).trim();
      } else if (line.startsWith("data:")) {
        dataLines.push(line.slice(5).trim());
      }
    }
    if (dataLines.length > 0) {
      frames.push({ event, data: dataLines.join("\n") });
    }
  }

  return { frames, rest };
}

export async function streamTutorMessage(
  conversationId: string,
  content: string,
  accessToken: string | null,
  handlers: TutorStreamHandlers,
): Promise<void> {
  let response: globalThis.Response;
  try {
    response = await fetch(`${API_BASE_URL}/tutor/conversations/${conversationId}/messages`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({ content }),
    });
  } catch {
    handlers.onError("Could not reach the server. Check your connection and try again.");
    return;
  }

  if (!response.ok || !response.body) {
    let message = `Request failed (${response.status})`;
    let code: string | undefined;
    try {
      const body = (await response.json()) as { message?: string; code?: string };
      message = body.message ?? message;
      code = body.code;
    } catch {
      // Non-JSON error body — fall back to the status-based message above.
    }
    handlers.onError(message, code);
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

    const { frames, rest } = parseFrames(buffer);
    buffer = rest;

    for (const frame of frames) {
      const payload = JSON.parse(frame.data) as Record<string, unknown>;
      if (frame.event === "token") {
        handlers.onToken(payload.text as string);
      } else if (frame.event === "citations") {
        handlers.onCitations(payload.citations as TutorCitation[]);
      } else if (frame.event === "done") {
        handlers.onDone(payload as { messageId: string; tokensIn: number | null; tokensOut: number | null });
      } else if (frame.event === "error") {
        handlers.onError(payload.message as string);
      }
    }
  }
}
