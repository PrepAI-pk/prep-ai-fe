export type WeakAreaStatus = "Needs work" | "Improving" | "Strong";

export type WeakArea = {
  subject: string;
  accuracy: number;
  solvedCount: number;
  status: WeakAreaStatus;
};

export type BookmarkTab = "bookmarks" | "weakAreas";