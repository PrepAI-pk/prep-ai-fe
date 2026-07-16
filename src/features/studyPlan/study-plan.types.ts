import type { AppScreen } from "../../app/screens";

export type WeakSubject = {
  subject: string;
  accuracy: number;
  solved: number;
};

export type TaskItem = {
  id: string;
  title: string;
  subject: string;
  type: "Practice" | "Revision" | "Mock" | "Review";
  priority: "High" | "Medium" | "Low";
  minutes: number;
  targetScreen: AppScreen;
};

export type PlanDay = {
  d: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  today?: boolean;
  tasks: TaskItem[];
};

export type StudyPlanPageProps = {
  onNavigateScreen?: (screen: AppScreen) => void;
};
