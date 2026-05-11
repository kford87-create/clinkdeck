import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import DeleteListingButton from "@/app/components/DeleteListingButton";
import InquiryForm from "@/app/components/InquiryForm";
import ShareButton from "@/app/components/ShareButton";
import Visual from "@/app/components/visuals/Visual";
import { ARCHETYPE_META, type Archetype } from "@/app/lib/archetypes";

export async function generateMetadata(
  props: PageProps<"/l/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const listing = await prisma.listing.findUnique({
    where: { slug },
    select: { title: true, summary: true, status: true },
  });
  if (!listing || listing.status !== "PUBLISHED") {
    return { title: "Build not found · Clinkdeck" };
  }
  return {
    title: `${listing.title} · Clinkdeck`,
    description: listing.summary,
    openGraph: {
      title: listing.title,
      description: listing.summary,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: listing.title,
      description: listing.summary,
    },
  };
}

export default async function ListingPage(props: PageProps<"/l/[slug]">) {
  const { slug } = await props.params;
  const me = await getCurrentUser();
  const listing = await prisma.listing.findUnique({
    where: { slug },
    include: { creator: true },
  });
  if (!listing || listing.status !== "PUBLISHED") notFound();

  const isOwner = me?.id === listing.creator.id;
  const canInquire = !!me && me.onboarded && !isOwner;
  const needsOnboarding = !!me && !me.onboarded && !isOwner;
  const tags = parseTags(listing.tags);
  const archetypeMeta =
    ARCHETYPE_META[listing.archetype as Archetype] ?? null;

  const baseUrl = (process.env.APP_URL ?? "http://localhost:3000").replace(
    /\/$/,
    ""
  );
  const listingUrl = `${baseUrl}/l/${listing.slug}`;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            {listing.title}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            {listing.summary}
          </p>
        </div>
        <div className="flex-shrink-0 sm:pt-1">
          <ShareButton
            listingUrl={listingUrl}
            listingTitle={listing.title}
            creatorName={listing.creator.name}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <div className="min-w-0 space-y-8">
          {/* Animated visual */}
          <div>
            <Visual
              archetype={listing.archetype}
              visualLabels={listing.visualLabels}
              themeColor={listing.themeColor}
            />
            {archetypeMeta && (
              <p className="text-xs text-zinc-500 mt-2">
                {archetypeMeta.name} · {archetypeMeta.tagline}
              </p>
            )}
          </div>

          {hasBuildStory(listing) && (
            <Section title="Build story">
              <dl className="grid sm:grid-cols-2 gap-4">
                {listing.problem && (
                  <BuildStoryItem
                    label="Problem this solves"
                    value={listing.problem}
                  />
                )}
                {listing.builtWith && (
                  <BuildStoryItem label="Built with" value={listing.builtWith} />
                )}
                {listing.buildTime && (
                  <BuildStoryItem
                    label="How long it took"
                    value={listing.buildTime}
                  />
                )}
                {listing.hardestPart && (
                  <BuildStoryItem
                    label="Hardest part"
                    value={listing.hardestPart}
                  />
                )}
              </dl>
            </Section>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <CreatorCard creator={listing.creator} />

          {isOwner ? (
            <OwnerControls
              listingId={listing.id}
              slug={listing.slug}
              listingTitle={listing.title}
              featuredUntil={listing.featuredUntil}
            />
          ) : canInquire ? (
            <InquiryForm
              listingId={listing.id}
              defaultSubject={`Re: ${listing.title}`}
            />
          ) : needsOnboarding ? (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 text-sm">
              <div className="font-medium mb-1">Almost there</div>
              <p className="text-zinc-500 mb-3">
                Finish setting up your profile and you can send inquiries.
              </p>
              <Link href="/onboarding" className="text-teal-700 hover:underline">
                Finish setup →
              </Link>
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 text-sm">
              <div className="font-medium mb-1">Sign in to contact the maker</div>
              <p className="text-zinc-500 mb-3">
                Inquiries are gated to keep things real on both sides.
              </p>
              <Link href="/signin" className="text-teal-700 hover:underline">
                Sign in →
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function parseTags(tags: string) {
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function hasBuildStory(listing: {
  problem: string;
  builtWith: string;
  buildTime: string;
  hardestPart: string;
}) {
  return Boolean(
    listing.problem ||
      listing.builtWith ||
      listing.buildTime ||
      listing.hardestPart
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-base font-semibold mb-3">{title}</h2>
      {children}
    </section>
  );
}

function BuildStoryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
      <dt className="text-xs uppercase tracking-wide text-zinc-500 mb-1">
        {label}
      </dt>
      <dd className="text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-line">
        {value}
      </dd>
    </div>
  );
}

function OwnerControls({
  listingId,
  slug,
  listingTitle,
  featuredUntil,
}: {
  listingId: string;
  slug: string;
  listingTitle: string;
  featuredUntil: Date | null;
}) {
  const isFeatured =
    featuredUntil != null && featuredUntil.getTime() > Date.now();
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 text-sm space-y-3">
      <div>
        <div className="font-medium mb-1">This is your build</div>
        <p className="text-zinc-500">
          Anyone can see this and send you an inquiry. Replies live in your
          inbox.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800 items-center">
        <Link
          href={`/l/${slug}/edit`}
          className="px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-medium"
        >
          Edit
        </Link>
        <Link
          href="/inquiries"
          className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs"
        >
          Open inbox
        </Link>
        <Link
          href={`/l/${slug}/feature`}
          className="px-3 py-1.5 rounded-lg border border-teal-300 dark:border-teal-800 text-teal-700 dark:text-teal-400 text-xs"
        >
          {isFeatured ? "Extend feature" : "Feature this build"}
        </Link>
        <div className="ml-auto">
          <DeleteListingButton listingId={listingId} listingTitle={listingTitle} />
        </div>
      </div>
      {isFeatured && (
        <div className="text-xs text-zinc-500 pt-1">
          Featured until{" "}
          {featuredUntil!.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
          .
        </div>
      )}
    </div>
  );
}

function CreatorCard({
  creator,
}: {
  creator: {
    handle: string;
    name: string;
    bio: string | null;
    avatarColor: string;
    websiteUrl: string | null;
    calLink: string | null;
  };
}) {
  return (
    <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
      <Link href={`/c/${creator.handle}`} className="flex items-center gap-3 group">
        <div
          className="h-12 w-12 rounded-full"
          style={{ background: creator.avatarColor }}
        />
        <div>
          <div className="font-semibold group-hover:text-teal-700">
            {creator.name}
          </div>
          <div className="text-xs text-zinc-500">@{creator.handle}</div>
        </div>
      </Link>
      {creator.bio && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3">
          {creator.bio}
        </p>
      )}
      {creator.calLink && (
        <a
          href={creator.calLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-4 px-3 py-2 rounded-lg text-center text-sm bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
        >
          Book a discovery call →
        </a>
      )}
    </section>
  );
}

