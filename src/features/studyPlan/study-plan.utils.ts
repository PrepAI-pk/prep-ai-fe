import type { WeakSubject, PlanDay } from "./study-plan.types";

export function scoreFromSubject(subject: string): number {
  let hash = 0;
  for (let i = 0; i < subject.length; i += 1) {
    hash = (hash * 31 + subject.charCodeAt(i)) % 997;
  }
  return hash;
}

export function deriveWeakSubjects(subjects: string[]): WeakSubject[] {
  return subjects
    .map((subject) => {
      const seed = scoreFromSubject(subject);
      const accuracy = 42 + (seed % 43);
      const solved = 24 + (seed % 90);
      return { subject, accuracy, solved };
    })
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);
}

export function createWeekPlan(weakSubjects: WeakSubject[], dailyHours: number): PlanDay[] {
  const s1 = weakSubjects[0]?.subject ?? "Pakistan Affairs";
  const s2 = weakSubjects[1]?.subject ?? "Current Affairs";
  const s3 = weakSubjects[2]?.subject ?? "General Knowledge";
  const block = Math.max(1, dailyHours) * 15;

  return [
    {
      d: "Mon",
      tasks: [
        {
          id: "m1",
          type: "Practice",
          subject: s1,
          title: `Timed MCQ drill: ${s1}`,
          minutes: block + 15,
          priority: "High",
          targetScreen: "practice",
        },
        {
          id: "m2",
          type: "Revision",
          subject: s2,
          title: `Concept recap: ${s2}`,
          minutes: block,
          priority: "Medium",
          targetScreen: "notesRevision",
        },
      ],
    },
    {
      d: "Tue",
      tasks: [
        {
          id: "t1",
          type: "Practice",
          subject: s3,
          title: `Accuracy set: ${s3}`,
          minutes: block + 10,
          priority: "High",
          targetScreen: "practice",
        },
        {
          id: "t2",
          type: "Revision",
          subject: s1,
          title: `Short revision: ${s1}`,
          minutes: block,
          priority: "Medium",
          targetScreen: "notesRevision",
        },
      ],
    },
    {
      d: "Wed",
      tasks: [
        {
          id: "w1",
          type: "Mock",
          subject: s2,
          title: `Timed mock: ${s2}`,
          minutes: 45,
          priority: "High",
          targetScreen: "mockExams",
        },
      ],
    },
    {
      d: "Thu",
      tasks: [
        {
          id: "th1",
          type: "Review",
          subject: s3,
          title: `Review weak MCQs: ${s3}`,
          minutes: block + 20,
          priority: "High",
          targetScreen: "mcqLibrary",
        },
      ],
    },
    {
      d: "Fri",
      tasks: [
        {
          id: "f1",
          type: "Practice",
          subject: s1,
          title: `Mixed accuracy set: ${s1}`,
          minutes: block + 15,
          priority: "Medium",
          targetScreen: "practice",
        },
        {
          id: "f2",
          type: "Revision",
          subject: s2,
          title: `Micro revision: ${s2}`,
          minutes: 20,
          priority: "Low",
          targetScreen: "notesRevision",
        },
      ],
    },
    {
      d: "Sat",
      today: true,
      tasks: [
        {
          id: "s1",
          type: "Mock",
          subject: "Mixed",
          title: "Full mock exam",
          minutes: 60,
          priority: "High",
          targetScreen: "mockExams",
        },
      ],
    },
    {
      d: "Sun",
      tasks: [
        {
          id: "su1",
          type: "Review",
          subject: "Mixed",
          title: "Weekly review & reflection",
          minutes: 30,
          priority: "Medium",
          targetScreen: "mcqLibrary",
        },
      ],
    },
  ];
}
