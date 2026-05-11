import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/app/lib/prisma";

export const metadata: Metadata = {
  title: "You're featured · Clinkdeck",
};

export default async function FeatureSuccessPage(
  props: PageProps<"/l/[slug]/feature/success">,
) {
  const { slug } = await props.params;
  const listing = await prisma.listing.findUnique({
    where: { slug },
    select: { slug: true, title: true, featuredUntil: true },
  });
  if (!listing) notFound();

  const isActive =
    listing.featuredUntil && listing.featuredUntil.getTime() > Date.now();

  return (
    <div className="max-w-xl mx-auto px-6 py-16 text-center">
      <h1 className="text-3xl font-semibold tracking-tight mb-3">
        Payment received
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-2">
        Thanks for boosting{" "}
        <span className="font-semibold">{listing.title}</span>.
      </p>
      {isActive ? (
        <p className="text-sm text-zinc-500 mb-8">
          Featured until{" "}
          {listing.featuredUntil!.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
          .
        </p>
      ) : (
        <p className="text-sm text-zinc-500 mb-8">
          The featured window will activate within a minute as the webhook
          confirms the payment. Refresh in a moment.
        </p>
      )}
      <Link
        href={`/l/${listing.slug}`}
        className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-medium"
      >
        Back to your listing →
      </Link>
    </div>
  );
}
