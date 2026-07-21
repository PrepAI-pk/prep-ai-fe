export type TutorContextType = "note" | "question";
export type TutorMessageRole = "user" | "ai";

export type TutorCitation = {
  sourceType: "NOTE" | "QUESTION" | "DOCUMENT" | "LESSON";
  sourceId: string;
  title: string;
  score: number;
};

export type TutorMessage = {
  id: string;
  role: TutorMessageRole;
  content: string;
  citations: TutorCitation[] | null;
  tokensIn: number | null;
  tokensOut: number | null;
  createdAt: string;
};

export type TutorConversationSummary = {
  id: string;
  title: string | null;
  contextType: TutorContextType | null;
  contextId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TutorConversationDetail = TutorConversationSummary & {
  messages: TutorMessage[];
};

export type CreateTutorConversationPayload = {
  contextType?: TutorContextType;
  contextId?: string;
};

export type TutorSuggestionsResponse = {
  items: string[];
};
