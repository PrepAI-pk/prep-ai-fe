export type PackState = "available" | "downloading" | "downloaded";

export type OfflinePack = {
  id: string;
  subject: string;
  body: string;
  sizeMb: number;
  lessons: number;
};

export type PersistedPackState = Record<
  string,
  {
    state: PackState;
    prog: number;
  }
>;

export const OFFLINE_PACKS_STORAGE_KEY = "prepai_packs";
export const OFFLINE_QUOTA_MB = 200;

export const OFFLINE_PACKS: OfflinePack[] = [
  { id: "pak-aff", subject: "Pakistan Affairs", body: "CSS", sizeMb: 28, lessons: 42 },
  { id: "curr-aff", subject: "Current Affairs", body: "PMS", sizeMb: 24, lessons: 38 },
  { id: "isl", subject: "Islamic Studies", body: "CSS", sizeMb: 18, lessons: 31 },
  { id: "gk", subject: "General Knowledge", body: "NTS", sizeMb: 22, lessons: 46 },
  { id: "english", subject: "English Essay", body: "CSS", sizeMb: 35, lessons: 27 },
  { id: "everyday", subject: "Everyday Science", body: "FPSC", sizeMb: 30, lessons: 39 },
];

export function defaultPackState(): PersistedPackState {
  return {
    "pak-aff": { state: "downloaded", prog: 100 },
    "curr-aff": { state: "available", prog: 0 },
    isl: { state: "available", prog: 0 },
    gk: { state: "downloaded", prog: 100 },
    english: { state: "available", prog: 0 },
    everyday: { state: "available", prog: 0 },
  };
}

export function sanitizePackState(value: unknown): PersistedPackState | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const candidate = value as Record<string, { state?: unknown; prog?: unknown }>;
  const out: PersistedPackState = {};

  for (const [packId, data] of Object.entries(candidate)) {
    const state =
      data?.state === "available" || data?.state === "downloaded" || data?.state === "downloading"
        ? data.state
        : "available";
    const prog = typeof data?.prog === "number" && Number.isFinite(data.prog) ? data.prog : 0;

    out[packId] = {
      state,
      prog: Math.max(0, Math.min(100, Math.round(prog))),
    };
  }

  return out;
}

export function readPackState(): PersistedPackState {
  const fallback = defaultPackState();

  try {
    const raw = localStorage.getItem(OFFLINE_PACKS_STORAGE_KEY);
    if (!raw) {
      return fallback;
    }

    const parsed = sanitizePackState(JSON.parse(raw));
    if (!parsed) {
      return fallback;
    }

    const merged: PersistedPackState = { ...fallback, ...parsed };

    // Interrupted downloads must reset on reload.
    for (const id of Object.keys(merged)) {
      if (merged[id].state === "downloading") {
        merged[id] = { state: "available", prog: 0 };
      }
    }

    return merged;
  } catch {
    return fallback;
  }
}

export function writePackState(state: PersistedPackState): void {
  try {
    localStorage.setItem(OFFLINE_PACKS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore localStorage write failures.
  }
}
