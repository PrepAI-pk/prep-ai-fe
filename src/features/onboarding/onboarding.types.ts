// Values match the backend's enums exactly (DATABASE.md) so they can be sent
// straight through to PATCH /onboarding without a lossy client-side mapping.
export type StudyTimeline = "1 month" | "3 months" | "6 months" | "Just exploring";
export type CurrentLevel = "FRESH_START" | "SOME_PREPARATION" | "WELL_PREPARED";
export type DailyHours = "1h" | "2h" | "3h" | "4h+";
