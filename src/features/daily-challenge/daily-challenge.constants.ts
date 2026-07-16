export const XP_CORRECT = 15;
export const XP_WRONG = 5;
export const XP_PER_LEVEL = 2200;
export const BADGE_TOTAL_XP = 15240;

export const LEVEL_NAMES = [
  "Novice",
  "Apprentice",
  "Learner",
  "Adept",
  "Skilled",
  "Proficient",
  "Scholar",
  "Expert",
  "Master",
  "Sage",
] as const;

export const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export type BadgeDef = {
  id: string;
  name: string;
  desc: string;
  sym: string;
  tone: "a" | "p" | "g";
  earned: boolean;
  cur?: number;
  goal?: number;
};

export const BADGE_DEFS: BadgeDef[] = [
  { id: "b1", name: "First Steps", desc: "Finish your first daily challenge", sym: "✦", tone: "p", earned: true },
  { id: "b2", name: "Week Warrior", desc: "Keep a 7-day streak alive", sym: "♦", tone: "a", earned: true },
  { id: "b3", name: "Sharp Shooter", desc: "Score 5 / 5 in a daily challenge", sym: "◎", tone: "g", earned: true },
  { id: "b4", name: "Centurion", desc: "Solve 100 questions", sym: "★", tone: "a", earned: true },
  { id: "b5", name: "Mock Master", desc: "Complete 10 mock exams", sym: "▲", tone: "p", earned: true },
  { id: "b6", name: "Top 100", desc: "Break into the national top 100", sym: "♛", tone: "a", earned: true },
  { id: "b7", name: "Marathon", desc: "Reach a 30-day streak", sym: "⚡", tone: "p", earned: false, cur: 12, goal: 30 },
  { id: "b8", name: "20k Club", desc: "Earn 20,000 total XP", sym: "◆", tone: "a", earned: false, cur: 15240, goal: 20000 },
  { id: "b9", name: "Constitution Pro", desc: "Hit 90% in Pak Constitution", sym: "⚖", tone: "g", earned: false, cur: 52, goal: 90 },
  { id: "b10", name: "Polymath", desc: "80%+ accuracy in every subject", sym: "✧", tone: "p", earned: false },
  { id: "b11", name: "Early Bird", desc: "5 sessions before 8 AM", sym: "☀", tone: "a", earned: false, cur: 2, goal: 5 },
  { id: "b12", name: "Flawless Week", desc: "Perfect daily score 7 days running", sym: "✔", tone: "g", earned: false },
];

export type ChallengeQuestion = {
  id: number;
  subject: string;
  difficulty: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export const challengeQuestions: ChallengeQuestion[] = [
  {
    id: 1,
    subject: "Constitution",
    difficulty: "Medium",
    question: "Which article includes the Objectives Resolution in Pakistan's Constitution?",
    options: ["Article 2", "Article 2A", "Article 25", "Article 62"],
    correctIndex: 1,
    explanation:
      "Article 2A incorporates the Objectives Resolution of 1949 as a substantive part of the Constitution, making its principles directly enforceable.",
  },
  {
    id: 2,
    subject: "Geography",
    difficulty: "Easy",
    question: "Largest province of Pakistan by area is:",
    options: ["Punjab", "Sindh", "Balochistan", "Khyber Pakhtunkhwa"],
    correctIndex: 2,
    explanation:
      "Balochistan covers approximately 347,190 km² — nearly 44% of Pakistan's total land area, making it the largest province by far.",
  },
  {
    id: 3,
    subject: "International",
    difficulty: "Easy",
    question: "SAARC stands for:",
    options: [
      "South Asian Association for Regional Cooperation",
      "South Asia and Arab Regional Council",
      "Strategic Asian Alliance for Regional Commerce",
      "State Alliance for Asian Republic Cooperation",
    ],
    correctIndex: 0,
    explanation:
      "SAARC (South Asian Association for Regional Cooperation) was established in 1985 in Dhaka, Bangladesh, comprising eight member states.",
  },
];

export const ChallengeState = {
  Intro: "intro",
  Play: "play",
  Done: "done",
} as const;

export type ChallengeState = (typeof ChallengeState)[keyof typeof ChallengeState];

export type UnlockedBadge = { name: string; sym: string; xp: number };
