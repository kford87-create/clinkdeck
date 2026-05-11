import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { startFeatureCheckout } from "@/app/lib/feature-actions";
import { FEATURE_TIERS } from "@/app/lib/stripe";

export const metadata: Metadata = {
  title: "Feature this build · Clinkdeck",
};

export default async function FeaturePage(props: PageProps<"/l/[slug]/feature">) {
  const { slug } = await props.params;
  const me = await getCurrentUser();
  if (!me) redirect(`/signin?next=/l/${slug}/feature`);

  const listing = await prisma.listing.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      title: true,
      summary: true,
      creatorId: true,
      featuredUntil: true,
    },
  });
  if (!listing) notFound();
  if (listing.creatorId !== me.id) {
    redirect(`/l/${slug}`);
  }

  const now = Date.now();
  const activeUntil =
    listing.featuredUntil && listing.featuredUntil.getTime() > now
      ? listing.featuredUntil
      : null;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <Link
        href={`/l/${slug}`}
        className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
      >
        ← Back to listing
      </Link>
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-3 mb-2">
        Feature this build
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-2">
        Featured builds sort to the top of the homepage and show a Featured
        badge on the card.
      </p>
      <p className="text-sm text-zinc-500 mb-8">
        Promoting: <span className="font-medium">{listing.title}</span>
      </p>

      {activeUntil && (
        <div className="rounded-xl border border-teal-200 bg-teal-50 dark:border-teal-900 dark:bg-teal-950/40 p-4 mb-6 text-sm">
          Already featured until{" "}
          <span className="font-semibold">
            {activeUntil.toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
          . Purchasing again extends the window.
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {(Object.keys(FEATURE_TIERS) as Array<keyof typeof FEATURE_TIERS>).map(
          (key) => {
            const tier = FEATURE_TIERS[key];
            return (
              <form
                key={key}
                action={startFeatureCheckout}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5"
              >
                <input type="hidden" name="listingId" value={listing.id} />
                <input type="hidden" name="tier" value={key} />
                <div className="text-lg font-semibold">{tier.label}</div>
                <div className="text-2xl font-bold tracking-tight mt-1">
                  ${(tier.amountCents / 100).toFixed(0)}
                </div>
                <div className="text-xs text-zinc-500 mb-4">
                  one-time · USD
                </div>
                <button
                  type="submit"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-medium"
                >
                  Continue to checkout →
                </button>
              </form>
            );
          },
        )}
      </div>

      <p className="text-xs text-zinc-500 mt-8">
        Payments are processed by Stripe. You&apos;ll get a receipt by email.
        Featured status is applied as soon as payment confirms.
      </p>
    </div>
  );
}
