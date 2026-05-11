import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import ListingCard from "@/app/components/ListingCard";
import ConversionTracker from "@/app/components/ConversionTracker";

export default async function CreatorProfile(
  props: PageProps<"/c/[handle]">
) {
  const { handle } = await props.params;
  const sp = await props.searchParams;
  const justSignedUp = sp.signup === "1";
  const signupConversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_SIGNUP_LABEL;
  const me = await getCurrentUser();
  const creator = await prisma.user.findUnique({
    where: { handle },
    include: {
      listings: {
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        include: { creator: true },
      },
    },
  });
  if (!creator) notFound();
  const isMe = me?.id === creator.id;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {justSignedUp && signupConversionLabel && (
        <ConversionTracker sendTo={signupConversionLabel} />
      )}
      <div
        className="rounded-2xl mb-6 p-6 sm:p-8"
        style={{
          background: `linear-gradient(135deg, ${creator.avatarColor}22, ${creator.avatarColor}05)`,
        }}
      >
        <div className="flex items-start gap-5">
          <div
            className="h-20 w-20 sm:h-24 sm:w-24 rounded-full flex-shrink-0"
            style={{ background: creator.avatarColor }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                {creator.name}
              </h1>
              {isMe && (
                <Link
                  href="/settings"
                  className="text-xs text-teal-700 hover:underline"
                >
                  Edit profile →
                </Link>
              )}
            </div>
            <div className="text-sm text-zinc-500 mt-0.5">@{creator.handle}</div>
            {creator.bio && (
              <p className="text-zinc-700 dark:text-zinc-300 mt-3 max-w-2xl">
                {creator.bio}
              </p>
            )}
            {(creator.websiteUrl || creator.calLink) && (
              <div className="flex gap-2 mt-4">
                {creator.websiteUrl && (
                  <a
                    href={creator.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg text-sm border border-zinc-300 dark:border-zinc-700 hover:bg-white dark:hover:bg-zinc-900"
                  >
                    Website ↗
                  </a>
                )}
                {creator.calLink && (
                  <a
                    href={creator.calLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg text-sm bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                  >
                    Book a call
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-lg font-semibold">Builds</h2>
        {isMe && (
          <Link href="/new" className="text-sm text-teal-700 hover:underline">
            + Add a build
          </Link>
        )}
      </div>
      {creator.listings.length === 0 ? (
        <p className="text-zinc-500 italic text-sm">
          {isMe ? (
            <>
              You haven&apos;t shipped anything yet.{" "}
              <Link href="/new" className="text-teal-700 hover:underline">
                Add your first build.
              </Link>
            </>
          ) : (
            <>{creator.name} hasn&apos;t shipped anything yet.</>
          )}
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {creator.listings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}
    </div>
  );
}
