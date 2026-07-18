export type WeakAreaStatus = "STRONG" | "IMPROVING" | "NEEDS_WORK";

export type WeakAreaSubject = {
  subjectId: string;
  name: string;
  acc: number;
  solved: number;
  status: WeakAreaStatus;
};

export type WeakAreasResponse = {
  subjects: WeakAreaSubject[];
  insight: string;
  generatedAt: string;
};
