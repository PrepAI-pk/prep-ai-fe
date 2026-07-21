export type PlanTier = "FREE" | "PRO" | "ELITE";
export type BillingCycle = "MONTHLY" | "ANNUAL";
export type SubStatus = "ACTIVE" | "PAST_DUE" | "CANCELED" | "TRIALING";

export type PlanCard = {
  tier: PlanTier;
  name: string;
  tagline: string;
  m: number;
  a: number;
  currency: string;
  cta: string;
  popular: boolean;
  feats: string[];
};

export type ComparisonRow = {
  f: string;
  free: string;
  pro: string;
  elite: string;
};

export type PlansResponse = {
  plans: PlanCard[];
  compare: ComparisonRow[];
};

export type Subscription = {
  tier: PlanTier;
  planName: string;
  cycle: BillingCycle;
  status: SubStatus;
  priceMonthly: number;
  priceAnnual: number;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
};

export type CheckoutRequest = {
  tier: Extract<PlanTier, "PRO" | "ELITE">;
  cycle: BillingCycle;
};

export type CheckoutResponse = {
  redirectUrl: string;
};

export type Invoice = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  issuedAt: string;
};

export type ListInvoicesResponse = {
  items: Invoice[];
};
