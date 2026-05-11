"use server";

import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import { getCurrentUser } from "./auth";
import { stripe, FEATURE_TIERS, type FeatureTier } from "./stripe";

function appUrl() {
  const fromEnv = process.env.APP_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.NODE_ENV === "production") {
    throw new Error("APP_URL is not set in production.");
  }
  return "http://localhost:3000";
}

export async function startFeatureCheckout(formData: FormData) {
  const me = await getCurrentUser();
  if (!me) throw new Error("Sign in required");
  if (!stripe) throw new Error("Stripe is not configured");

  const listingId = String(formData.get("listingId") ?? "");
  const tierKey = String(formData.get("tier") ?? "") as FeatureTier;
  const tier = FEATURE_TIERS[tierKey];
  if (!tier) throw new Error("Invalid tier");

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { id: true, slug: true, title: true, creatorId: true },
  });
  if (!listing) throw new Error("Listing not found");
  if (listing.creatorId !== me.id)
    throw new Error("Only the listing owner can feature it");

  const base = appUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: tier.amountCents,
          product_data: {
            name: `Feature "${listing.title}" — ${tier.label}`,
          },
        },
      },
    ],
    success_url: `${base}/l/${listing.slug}/feature/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/l/${listing.slug}/feature`,
    metadata: {
      listingId: listing.id,
      tier: tierKey,
      days: String(tier.days),
    },
  });

  if (!session.url) throw new Error("Stripe returned no checkout URL");
  redirect(session.url);
}
