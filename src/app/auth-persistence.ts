const SESSION_KEY = "prepai_session";

export type StoredSession = {
  name: string;
  email: string;
};

export function readSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as StoredSession) : null;
  } catch {
    return null;
  }
}

export function hasSession(): boolean {
  return readSession() !== null;
}

export function persistSession(session: StoredSession): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // Ignore localStorage write failures.
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // Ignore localStorage write failures.
  }
}
