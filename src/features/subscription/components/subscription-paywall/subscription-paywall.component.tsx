import { useState } from "react";
import { Alert, Box, Button, Paper, Typography } from "@mui/material";
import type { AppScreen } from "../../../../app/screens";
import { PracticeTopbar } from "../../../practice";
import {
  useCheckoutMutation,
  useGetPlansQuery,
  useGetSubscriptionQuery,
} from "../../../../api/billing/billing.endpoints";
import type { BillingCycle, PlanTier } from "../../../../api/billing/billing.types";
import { toApiErrorMessage } from "../../../../api/error";
import {
  billingHintSx,
  billingOptionSx,
  comparisonRowSx,
  ctaButtonSx,
  featureCheckSx,
  featureTextSx,
  planCardSx,
  planSubtitleSx,
  priceSuffixSx,
  subscriptionPaywallStyles,
} from "./subscription-paywall.styles";

type SubscriptionPaywallPageProps = {
  onNavigateScreen?: (screen: AppScreen) => void;
};

export function SubscriptionPaywallPage(props: SubscriptionPaywallPageProps = {}) {
  const { onNavigateScreen } = props;
  const [billingMode, setBillingMode] = useState<BillingCycle>("ANNUAL");
  const [message, setMessage] = useState<{ severity: "success" | "error"; text: string } | null>(null);
  const [checkoutTier, setCheckoutTier] = useState<PlanTier | null>(null);

  const plansQuery = useGetPlansQuery();
  const subscriptionQuery = useGetSubscriptionQuery();
  const [checkout, { isLoading: isCheckingOut }] = useCheckoutMutation();

  const plans = plansQuery.data?.plans ?? [];
  const compare = plansQuery.data?.compare ?? [];
  const currentTier = subscriptionQuery.data?.tier;

  async function handleChoosePlan(tier: PlanTier): Promise<void> {
    if (tier === "FREE") {
      return;
    }

    setMessage(null);
    setCheckoutTier(tier);
    try {
      await checkout({ tier, cycle: billingMode }).unwrap();
      setMessage({ severity: "success", text: "Subscription updated. Manage it any time from Settings." });
    } catch (error) {
      setMessage({ severity: "error", text: toApiErrorMessage(error, "Couldn't update your subscription.") });
    } finally {
      setCheckoutTier(null);
    }
  }

  return (
    <Box sx={subscriptionPaywallStyles.shell}>
        <PracticeTopbar
          currentScreen="subscriptionPaywall"
          title="Subscription Paywall"
          subtitle="Choose a plan that fits your exam target and pace"
          searchPlaceholder="Search Plans"
          onOpenGlobalSearch={() => onNavigateScreen?.("globalSearch")}
          onOpenSettings={() => onNavigateScreen?.("settingsProfile")}
          onNavigateScreen={onNavigateScreen}
        />

        <Box sx={subscriptionPaywallStyles.scrollBody}>
          <Box sx={subscriptionPaywallStyles.wrap}>
            <Box sx={subscriptionPaywallStyles.hero}>
              <Typography sx={{ fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "secondary.main", fontWeight: 700, fontFamily: '"Space Mono", monospace' }}>
                Upgrade
              </Typography>
              <Typography variant="h2" sx={{ fontSize: 32, mt: 1.1 }}>
                Invest in the result you are preparing for
              </Typography>
              <Typography sx={{ mt: 1, fontSize: 15, color: "text.secondary", lineHeight: 1.5 }}>
                Aspirants on Pro solve 3x more questions and are twice as likely to clear their screening. Cancel anytime.
              </Typography>
            </Box>

            {message && (
              <Alert severity={message.severity} onClose={() => setMessage(null)} sx={{ borderRadius: 2 }}>
                {message.text}
              </Alert>
            )}

            {plansQuery.isError && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                Could not load plans. {toApiErrorMessage(plansQuery.error, "Please try again.")}
              </Alert>
            )}

            <Box sx={subscriptionPaywallStyles.billingToggleWrap}>
              <Box sx={subscriptionPaywallStyles.billingToggle}>
                <Box
                  onClick={() => setBillingMode("MONTHLY")}
                  sx={billingOptionSx(billingMode === "MONTHLY")}
                >
                  Monthly
                </Box>
                <Box
                  onClick={() => setBillingMode("ANNUAL")}
                  sx={billingOptionSx(billingMode === "ANNUAL", true)}
                >
                  Annual
                  <Box sx={subscriptionPaywallStyles.annualBadge}>
                    -20%
                  </Box>
                </Box>
              </Box>
            </Box>

          <Box sx={subscriptionPaywallStyles.plansGrid}>
            {plans.map((plan) => {
              const price = billingMode === "ANNUAL" ? plan.a : plan.m;
              const isCurrent = plan.tier === currentTier;
              const isFree = plan.tier === "FREE";
              const buttonLabel = isCurrent ? "Current plan" : plan.cta;

              return (
                <Paper
                  key={plan.tier}
                  variant="outlined"
                  sx={planCardSx(plan.popular)}
                >
                  {plan.popular && (
                    <Box sx={subscriptionPaywallStyles.highlightedPill}>
                      Most popular
                    </Box>
                  )}
                  <Typography sx={{ fontFamily: '"Source Serif 4", serif', fontSize: 20, fontWeight: 700 }}>{plan.name}</Typography>
                  <Typography sx={planSubtitleSx(plan.popular)}>
                    {plan.tagline}
                  </Typography>
                  <Box sx={subscriptionPaywallStyles.priceRow}>
                    <Typography sx={{ fontFamily: '"Source Serif 4", serif', fontSize: 38, fontWeight: 700, letterSpacing: "-.02em", lineHeight: 1 }}>
                      {price === 0 ? "Free" : `Rs ${price.toLocaleString()}`}
                    </Typography>
                    <Typography sx={priceSuffixSx(plan.popular)}>
                      {price === 0 ? "forever" : "/ month"}
                    </Typography>
                  </Box>

                  <Typography sx={billingHintSx(plan.popular)}>
                    {price === 0 ? "" : billingMode === "ANNUAL" ? `Billed Rs ${(price * 12).toLocaleString()} yearly` : "Billed monthly"}
                  </Typography>

                  <Box sx={subscriptionPaywallStyles.featuresGrid}>
                    {plan.feats.map((feature) => (
                      <Box key={feature} sx={subscriptionPaywallStyles.featureRow}>
                        <Box sx={featureCheckSx(plan.popular)}>
                          ✓
                        </Box>
                        <Typography sx={featureTextSx(plan.popular)}>{feature}</Typography>
                      </Box>
                    ))}
                  </Box>

                  <Button
                    variant={isFree ? "outlined" : "contained"}
                    disabled={isCurrent || isFree || isCheckingOut}
                    onClick={() => void handleChoosePlan(plan.tier)}
                    sx={ctaButtonSx(plan.name as "Free" | "Pro" | "Elite", plan.popular)}
                    fullWidth
                  >
                    {isCheckingOut && checkoutTier === plan.tier ? "Updating…" : buttonLabel}
                  </Button>
                </Paper>
              );
            })}
          </Box>

          <Paper variant="outlined" sx={subscriptionPaywallStyles.comparisonCard}>
            <Typography sx={{ fontWeight: 700, mb: 0.8 }}>Feature comparison</Typography>

            <Box sx={subscriptionPaywallStyles.comparisonGrid}>
              <Box sx={subscriptionPaywallStyles.comparisonHeader}>
                <Typography sx={{ fontSize: 11 }}>Feature</Typography>
                <Typography sx={{ fontSize: 11, textAlign: "center" }}>Free</Typography>
                <Typography sx={{ fontSize: 11, textAlign: "center", color: "primary.main" }}>Pro</Typography>
                <Typography sx={{ fontSize: 11, textAlign: "center" }}>Elite</Typography>
              </Box>

              {compare.map((row) => (
                <Box key={row.f} sx={comparisonRowSx}>
                  <Typography sx={{ fontSize: 13.5, fontWeight: 600 }}>{row.f}</Typography>
                  <Typography sx={{ fontSize: 13.5, color: "text.secondary", textAlign: "center", fontFamily: '"Space Mono", monospace' }}>{row.free}</Typography>
                  <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: "primary.main", textAlign: "center", fontFamily: '"Space Mono", monospace' }}>{row.pro}</Typography>
                  <Typography sx={{ fontSize: 13.5, color: "text.secondary", textAlign: "center", fontFamily: '"Space Mono", monospace' }}>{row.elite}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          <Box sx={subscriptionPaywallStyles.guarantee}>
            <Box sx={subscriptionPaywallStyles.guaranteeDot}>
              ✓
            </Box>
            7-day money-back guarantee · secure payment · cancel anytime
          </Box>
          </Box>
        </Box>
      </Box>
  );
}
