export type BillingMode = "monthly" | "annual";

export type SubscriptionPlan = {
  name: "Free" | "Pro" | "Elite";
  priceMonthly: number;
  priceAnnual: number;
  features: string[];
  highlighted: boolean;
};

export type ComparisonRow = {
  label: string;
  free: string;
  pro: string;
  elite: string;
};

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    name: "Free",
    priceMonthly: 0,
    priceAnnual: 0,
    features: ["Basic practice", "Limited tutor replies", "Weekly challenge"],
    highlighted: false,
  },
  {
    name: "Pro",
    priceMonthly: 1500,
    priceAnnual: 14400,
    features: ["Unlimited MCQs", "Advanced analytics", "Priority AI tutor", "Mock exam insights"],
    highlighted: true,
  },
  {
    name: "Elite",
    priceMonthly: 2900,
    priceAnnual: 27840,
    features: ["Everything in Pro", "1:1 mentor sessions", "Essay review queue"],
    highlighted: false,
  },
];

export const SUBSCRIPTION_COMPARISON_ROWS: ComparisonRow[] = [
  { label: "MCQ Practice", free: "Basic", pro: "Unlimited", elite: "Unlimited" },
  { label: "Mock Exams", free: "2/mo", pro: "Unlimited", elite: "Unlimited" },
  { label: "AI Tutor", free: "20/day", pro: "Unlimited", elite: "Unlimited" },
  { label: "Mentor Support", free: "No", pro: "No", elite: "Yes" },
];

export function planTagline(planName: SubscriptionPlan["name"]): string {
  if (planName === "Free") {
    return "Get a feel for PrepAI";
  }

  if (planName === "Pro") {
    return "Everything you need to qualify";
  }

  return "Serious, guided preparation";
}
