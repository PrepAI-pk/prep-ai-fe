export type NoteBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "keyPoint"; text: string }
  | { type: "bullets"; items: string[] };

export type NoteItem = {
  id: string;
  subject: string;
  title: string;
  readMinutes: number;
  snippet: string;
  blocks: NoteBlock[];
};

export type Flashcard = {
  subject: string;
  front: string;
  back: string;
};