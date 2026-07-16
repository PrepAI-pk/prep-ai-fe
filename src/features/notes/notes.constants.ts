import type { Flashcard, NoteItem } from "./notes.types";

export const NOTES_FLASHCARDS: Flashcard[] = [
  {
    subject: "Pakistan Affairs",
    front: "Objectives Resolution was incorporated as which article?",
    back: "Article 2A of the Constitution of Pakistan.",
  },
  {
    subject: "General Knowledge",
    front: "Largest province by area in Pakistan?",
    back: "Balochistan.",
  },
  {
    subject: "Current Affairs",
    front: "What does SAARC stand for?",
    back: "South Asian Association for Regional Cooperation.",
  },
];

export const NOTES_ITEMS: NoteItem[] = [
  {
    id: "pak-affairs-federalism",
    subject: "Pakistan Affairs",
    title: "Federalism Evolution in Pakistan",
    readMinutes: 8,
    snippet: "How constitutional shifts changed center-province balance and exam angles.",
    blocks: [
      { type: "heading", text: "Historical Shift" },
      {
        type: "paragraph",
        text: "Pakistan's federal journey moved through centralized and devolved phases. For exams, link each constitutional era with administrative outcomes.",
      },
      {
        type: "keyPoint",
        text: "Always connect constitutional amendments to practical governance effects in one line.",
      },
      {
        type: "heading",
        text: "Exam Framing",
      },
      {
        type: "bullets",
        items: [
          "Compare 1956, 1962, and 1973 constitutional models.",
          "Mention 18th Amendment with center-province powers.",
          "Use one current policy example to show relevance.",
        ],
      },
    ],
  },
  {
    id: "current-affairs-water",
    subject: "Current Affairs",
    title: "Water Security Quick Revision",
    readMinutes: 6,
    snippet: "Concise map of treaty context, climate stress, and policy responses.",
    blocks: [
      { type: "heading", text: "Core Context" },
      {
        type: "paragraph",
        text: "Water security questions require layered analysis: treaty structure, climate variability, storage capacity, and diplomacy.",
      },
      {
        type: "keyPoint",
        text: "Avoid only descriptive answers; show causes, impacts, and actionable policy recommendations.",
      },
      {
        type: "bullets",
        items: [
          "Define stress indicators and current trends.",
          "Reference inter-provincial coordination challenges.",
          "Close with feasible short-term and long-term interventions.",
        ],
      },
    ],
  },
];