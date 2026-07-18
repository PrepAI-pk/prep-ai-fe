export type NoteSummary = {
  id: string;
  subject: { name: string };
  title: string;
  mins: number;
  snippet: string;
  aiGenerated: boolean;
};

export type ListNotesResponse = {
  items: NoteSummary[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

export type NoteBlock =
  | { t: "p"; text: string }
  | { t: "h"; text: string; id: string }
  | { t: "key"; text: string }
  | { t: "list"; items: string[] };

export type NoteDetail = {
  id: string;
  subject: { name: string };
  title: string;
  mins: number;
  aiGenerated: boolean;
  contents: { id: string; text: string }[];
  body: NoteBlock[];
};

export type Flashcard = {
  id: string;
  subject: { name: string };
  front: string;
  back: string;
};

export type ListFlashcardsResponse = {
  items: Flashcard[];
};
