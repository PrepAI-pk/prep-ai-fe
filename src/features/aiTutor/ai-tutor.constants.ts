export type ChatRole = "assistant" | "user";

export type ChatMessage = {
  id: number;
  role: ChatRole;
  text: string;
};

export const AI_TUTOR_SUGGESTED_PROMPTS = [
  "Explain this wrong mock exam answer",
  "Make a 7-day revision strategy for CSS",
  "Quiz me on Pakistan Affairs",
] as const;

export function createTutorReply(input: string): string {
  return [
    "PrepAI Tutor · knowledge base",
    "",
    `Understood. You asked: ${input}`,
    "Here is a concise strategy:",
    "1. Identify the concept behind the question.",
    "2. Compare your reasoning with the correct logic.",
    "3. Practice 5 similar MCQs with timed recall.",
  ].join("\n");
}
