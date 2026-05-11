import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

export const stripe = key ? new Stripe(key) : null;

export type FeatureTier = "1wk" | "4wk";

export const FEATURE_TIERS: Record<
  FeatureTier,
  { label: string; days: number; amountCents: number }
> = {
  "1wk": { label: "1 week", days: 7, amountCents: 2900 },
  "4wk": { label: "4 weeks", days: 28, amountCents: 9900 },
};
