import type { AdminDocument, AdminDraft } from "../features/admin";

export const INITIAL_ADMIN_DOCUMENTS: AdminDocument[] = [
  {
    id: "doc-base-1",
    type: "PDF",
    name: "PA_Core_Pack.pdf",
    pages: 32,
    date: "05/07/2026",
    mcqCount: 42,
    status: "published",
  },
  {
    id: "doc-base-2",
    type: "DOCX",
    name: "CA_Weekly_Brief.docx",
    pages: 18,
    date: "04/07/2026",
    mcqCount: 20,
    status: "review",
  },
];

export const INITIAL_ADMIN_DRAFTS: AdminDraft[] = [
  {
    id: "draft-base-1",
    subject: "Current Affairs",
    body: "PMS",
    difficulty: "Medium",
    question:
      "Which policy lever most directly reduces urban flood vulnerability?",
    options: [
      "Expanding unmanaged settlements",
      "Integrated drainage planning",
      "Reducing early warning alerts",
      "Cutting all municipal funding",
    ],
    correctIndex: 1,
    explanation:
      "Integrated drainage planning and maintenance reduce runoff bottlenecks and flood risk.",
    validation: "Validated",
    duplicate: "No duplicate",
    status: "pending",
  },
  {
    id: "draft-base-2",
    subject: "Islamic Studies",
    body: "CSS",
    difficulty: "Easy",
    question:
      "Which principle is central to social justice in Islamic governance discussions?",
    options: [
      "Tribal hierarchy",
      "Accountability",
      "Isolationism",
      "Patronage",
    ],
    correctIndex: 1,
    explanation:
      "Accountability is a core governance value in Islamic political thought.",
    validation: "Answer flagged",
    duplicate: "Possible duplicate",
    status: "pending",
  },
];