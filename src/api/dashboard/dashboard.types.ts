export type DashboardStat = {
  value: string | number;
  delta: string;
  good?: boolean;
  neutral?: boolean;
};

export type DashboardResponse = {
  greeting: { name: string; partOfDay: string };
  continue: {
    questionId: string;
    subjectName: string;
    topicTitle: string;
    progressPct: number;
  } | null;
  stats: {
    questionsSolved: DashboardStat;
    accuracy: DashboardStat;
    mockRank: DashboardStat;
    studyTime: DashboardStat;
  };
  weeklyActivity: { d: string; v: number; isToday: boolean }[];
  accuracyBySubject: { subjectId: string; name: string; acc: number }[];
  recommended: {
    tag: string;
    tone: string;
    topic: string;
    reason: string;
    targetRef: string;
  }[];
};
