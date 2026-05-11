import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";
import { prisma } from "@/app/lib/prisma";
import { stripe, FEATURE_TIERS, type FeatureTier } from "@/app/lib/stripe";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET not set" },
      { status: 500 },
    );
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${msg}` },
      { status: 400 },
    );
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (session.payment_status !== "paid") {
    return NextResponse.json({ received: true });
  }

  const listingId = session.metadata?.listingId;
  const tierKey = session.metadata?.tier as FeatureTier | undefined;
  if (!listingId || !tierKey || !FEATURE_TIERS[tierKey]) {
    return NextResponse.json(
      { error: "Missing or invalid metadata on session" },
      { status: 400 },
    );
  }

  const days = FEATURE_TIERS[tierKey].days;
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { id: true, slug: true, featuredUntil: true },
  });
  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  const now = new Date();
  const baseFrom =
    listing.featuredUntil && listing.featuredUntil > now
      ? listing.featuredUntil
      : now;
  const newUntil = new Date(baseFrom.getTime() + days * 24 * 60 * 60 * 1000);

  await prisma.listing.update({
    where: { id: listing.id },
    data: { featuredUntil: newUntil },
  });

  revalidatePath("/");
  revalidatePath(`/l/${listing.slug}`);
  revalidatePath(`/l/${listing.slug}/feature`);

  return NextResponse.json({ received: true });
}
