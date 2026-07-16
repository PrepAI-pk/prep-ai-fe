export const LIBRARY_ALL_FILTER = "All";

export function extractExam(subject: string): string {
  const match = subject.match(/\(([^)]+)\)/);
  return match?.[1] ?? "General";
}

export function normalize(text: string): string {
  return text.toLowerCase().trim();
}
