export type AdminDraftStatus = "pending" | "approved" | "rejected";

export type AdminDraft = {
  id: string;
  subject: string;
  body: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  validation: "Validated" | "Answer flagged";
  duplicate: "No duplicate" | "Possible duplicate";
  status: AdminDraftStatus;
};

export type AdminDocument = {
  id: string;
  type: "PDF" | "DOCX";
  name: string;
  pages: number;
  date: string;
  mcqCount: number;
  status: "published" | "review" | "processing" | "draft";
};
