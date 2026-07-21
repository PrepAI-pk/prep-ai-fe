export type ChatRole = "assistant" | "user";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  citations?: { title: string }[];
  streaming?: boolean;
};

// Fallback shown only until GET /tutor/suggestions resolves.
export const AI_TUTOR_SUGGESTED_PROMPTS = [
  "Explain this wrong mock exam answer",
  "Make a 7-day revision strategy for CSS",
  "Quiz me on Pakistan Affairs",
] as const;
