import { useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import type { AppScreen } from "../../../../app/screens";
import { PracticeTopbar } from "../../../practice";
import {
  type BillingMode,
  planTagline,
  SUBSCRIPTION_COMPARISON_ROWS,
  SUBSCRIPTION_PLANS,
} from "../../subscription.constants";
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
  const [billingMode, setBillingMode] = useState<BillingMode>("annual");

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

            <Box sx={subscriptionPaywallStyles.billingToggleWrap}>
              <Box sx={subscriptionPaywallStyles.billingToggle}>
                <Box
                  onClick={() => setBillingMode("monthly")}
                  sx={billingOptionSx(billingMode === "monthly")}
                >
                  Monthly
                </Box>
                <Box
                  onClick={() => setBillingMode("annual")}
                  sx={billingOptionSx(billingMode === "annual", true)}
                >
                  Annual
                  <Box sx={subscriptionPaywallStyles.annualBadge}>
                    -20%
                  </Box>
                </Box>
              </Box>
            </Box>

          <Box sx={subscriptionPaywallStyles.plansGrid}>
            {SUBSCRIPTION_PLANS.map((plan) => {
              const price = billingMode === "annual" ? plan.priceAnnual : plan.priceMonthly;

              return (
                <Paper
                  key={plan.name}
                  variant="outlined"
                  sx={planCardSx(plan.highlighted)}
                >
                  {plan.highlighted && (
                    <Box sx={subscriptionPaywallStyles.highlightedPill}>
                      Most popular
                    </Box>
                  )}
                  <Typography sx={{ fontFamily: '"Source Serif 4", serif', fontSize: 20, fontWeight: 700 }}>{plan.name}</Typography>
                  <Typography sx={planSubtitleSx(plan.highlighted)}>
                    {planTagline(plan.name)}
                  </Typography>
                  <Box sx={subscriptionPaywallStyles.priceRow}>
                    <Typography sx={{ fontFamily: '"Source Serif 4", serif', fontSize: 38, fontWeight: 700, letterSpacing: "-.02em", lineHeight: 1 }}>
                      {price === 0 ? "Free" : `Rs ${price.toLocaleString()}`}
                    </Typography>
                    <Typography sx={priceSuffixSx(plan.highlighted)}>
                      {price === 0 ? "forever" : "/ month"}
                    </Typography>
                  </Box>

                  <Typography sx={billingHintSx(plan.highlighted)}>
                    {price === 0 ? "" : billingMode === "annual" ? `Billed Rs ${(price * 12).toLocaleString()} yearly` : "Billed monthly"}
                  </Typography>

                  <Box sx={subscriptionPaywallStyles.featuresGrid}>
                    {plan.features.map((feature) => (
                      <Box key={feature} sx={subscriptionPaywallStyles.featureRow}>
                        <Box sx={featureCheckSx(plan.highlighted)}>
                          ✓
                        </Box>
                        <Typography sx={featureTextSx(plan.highlighted)}>{feature}</Typography>
                      </Box>
                    ))}
                  </Box>

                  <Button
                    variant={plan.name === "Free" ? "outlined" : "contained"}
                    sx={ctaButtonSx(plan.name, plan.highlighted)}
                    fullWidth
                  >
                    {plan.name === "Free" ? "Current plan" : `Choose ${plan.name}`}
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

              {SUBSCRIPTION_COMPARISON_ROWS.map((row) => (
                <Box key={row.label} sx={comparisonRowSx}>
                  <Typography sx={{ fontSize: 13.5, fontWeight: 600 }}>{row.label}</Typography>
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
