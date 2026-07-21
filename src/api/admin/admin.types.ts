// ── Documents / pipeline ────────────────────────────────────
export type AdminDocType = "PDF" | "DOCX" | "IMG";
export type AdminDocStatus = "PROCESSING" | "REVIEW" | "DRAFT" | "PUBLISHED" | "FAILED";
export type PipelineStageName =
  | "UPLOAD"
  | "OCR"
  | "EXTRACT_TEXT"
  | "AI_PROCESSING"
  | "GENERATE_MCQS"
  | "EXPLANATIONS"
  | "NOTES"
  | "CATEGORIZE"
  | "SAVE_DRAFT"
  | "REVIEW";
export type RunStatus = "IDLE" | "QUEUED" | "RUNNING" | "SUCCESS" | "WARNING" | "FAILED";

export type AdminDocumentRow = {
  id: string;
  type: AdminDocType;
  name: string;
  pages: number | null;
  date: string;
  mcqCount: number;
  status: AdminDocStatus;
};

export type AdminDocumentsResponse = {
  items: AdminDocumentRow[];
  total: number;
  page: number;
  pageSize: number;
};

export type PipelineStage = {
  order: number;
  stage: PipelineStageName;
  label: string;
  status: RunStatus;
  error?: string;
};

export type PipelineSnapshot = {
  runId: string;
  status: RunStatus;
  progress: number;
  currentStage: PipelineStageName | null;
  document: { id: string; name: string; type: AdminDocType; pages: number | null };
  stages: PipelineStage[];
  result: { error: string | null } | null;
};

export type RegisterDocumentPayload = {
  name: string;
  type: AdminDocType;
  storageKey: string;
  pages?: number;
  sizeBytes?: number;
};

// ── Review queue ─────────────────────────────────────────────
export type AdminReviewItem = {
  id: string;
  subject: { name: string };
  exam: { body: string } | null;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string | null;
  flags: {
    validation: "VALIDATED" | "ANSWER_FLAGGED" | "UNCHECKED";
    validationText: string;
    duplicate: "NO_DUPLICATE" | "POSSIBLE_DUPLICATE" | "UNCHECKED";
    duplicateText: string;
    duplicateOfId: string | null;
  };
  source: { documentId: string; name: string; page: number | null } | null;
  status: "pending";
};

export type AdminReviewQueueResponse = {
  items: AdminReviewItem[];
  total: number;
};

// ── Content manager ───────────────────────────────────────────
export type AdminSubjectRow = {
  id: string;
  slug: string;
  name: string;
  colorTint: string | null;
  order: number;
  questionCount: number;
};

export type AdminExamRow = {
  id: string;
  slug: string;
  body: string;
  name: string;
  level: string;
  questionCount: number;
  durationMins: number;
  negativeMark: number;
  isActive: boolean;
  linkedQuestionCount: number;
};

export type AdminNoteRow = {
  id: string;
  subject: { name: string };
  title: string;
  readMins: number;
  published: boolean;
};

export type AdminNotesResponse = { items: AdminNoteRow[]; total: number; page: number; pageSize: number };

export type AdminUserRow = {
  id: string;
  fullName: string;
  role: "STUDENT" | "REVIEWER" | "ADMIN";
  lastActiveDate: string | null;
  plan: "FREE" | "PRO" | "ELITE" | "STAFF" | "OWNER";
};

export type AdminUsersResponse = { items: AdminUserRow[]; total: number; page: number; pageSize: number };

export type AdminUserPatchPayload = {
  id: string;
  role?: "STUDENT" | "REVIEWER" | "ADMIN";
  planTier?: "FREE" | "PRO" | "ELITE" | "STAFF" | "OWNER";
};

// ── Agent ops / overview ─────────────────────────────────────
export type AdminAgentType =
  | "DOCUMENT_EXTRACTION"
  | "CATEGORIZATION"
  | "MCQ_GENERATION"
  | "DUPLICATE_DETECTION"
  | "VALIDATION"
  | "TRANSLATION";

export type AdminAgentRun = {
  id: string;
  agent: AdminAgentType;
  label: string;
  status: RunStatus;
  note: string | null;
  tokens: string;
  ms: number;
  createdAt: string;
};

export type AdminAgentRunsResponse = { items: AdminAgentRun[]; total: number; page: number; pageSize: number };

export type AdminPromptSummary = {
  agent: AdminAgentType;
  label: string;
  version: number | null;
  content: string | null;
  isActive: boolean;
};

export type AdminOverview = {
  stats: { documentsProcessed: number; mcqsPendingReview: number; publishedThisWeek: number; activeStudents: number };
  liveProcessing: { documentId: string; name: string; progress: number; stageLabel: string | null } | null;
  reviewQueue: { count: number };
  agentActivity: { agent: AdminAgentType; label: string; status: RunStatus; note: string | null; tokens: string }[];
};
