export type SearchResultType = "MCQ" | "NOTE" | "EXAM" | "SUBJECT";

export type SearchResultItem = {
  id: string;
  title: string;
  snippet: string | null;
  meta: string;
  targetRef: string;
  subjectName?: string;
};

export type SearchResultGroup = {
  type: SearchResultType;
  items: SearchResultItem[];
};

export type SearchResponse = {
  query: string;
  counts: Record<SearchResultType, number>;
  groups: SearchResultGroup[];
};

export type SearchSuggestionsResponse = {
  items: string[];
};

export type SearchParams = {
  q: string;
  types?: string;
};
