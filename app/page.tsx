import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import ListingCard from "./components/ListingCard";
import SponsorSlot from "./components/SponsorSlot";

export default async function Home() {
  const now = new Date();
  const [listings, featuredMaker] = await Promise.all([
    prisma.listing.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ featuredUntil: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }],
      include: { creator: true },
    }),
    prisma.user.findFirst({
      where: { listings: { some: { status: "PUBLISHED", featuredUntil: { gt: now } } } },
      include: {
        listings: {
          where: { status: "PUBLISHED" },
          orderBy: { createdAt: "desc" },
          take: 3,
          select: { slug: true, title: true },
        },
      },
    }),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <section className="mb-8 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 dark:from-cyan-950/40 dark:via-teal-950/40 dark:to-emerald-950/40">
        <div className="px-8 py-10 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3">
            Where AI builders showcase their talent.
          </h1>
          <p className="text-zinc-700 dark:text-zinc-300 mb-5">
            Every build gets an animated visual that shows what it does in ten
            seconds. No videos to record, no decks to read.
          </p>
          <div className="flex gap-3 text-sm">
            <Link
              href="/new"
              className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium"
            >
              Show your work →
            </Link>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <section className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight mb-4">
            Builds
          </h2>
          {listings.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-10 text-center text-zinc-500">
              No builds yet.{" "}
              <Link href="/new" className="text-teal-700 hover:underline font-medium">
                Be the first.
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-6">
          {featuredMaker && (
            <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
              <div className="text-xs uppercase tracking-wider text-teal-700 mb-2">
                Featured maker
              </div>
              <Link
                href={`/c/${featuredMaker.handle}`}
                className="flex items-center gap-3 mb-3 group"
              >
                <div
                  className="h-12 w-12 rounded-full"
                  style={{ background: featuredMaker.avatarColor }}
                />
                <div>
                  <div className="font-semibold group-hover:text-teal-700">
                    {featuredMaker.name}
                  </div>
                  <div className="text-xs text-zinc-500">
                    @{featuredMaker.handle}
                  </div>
                </div>
              </Link>
              {featuredMaker.bio && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                  {featuredMaker.bio}
                </p>
              )}
              <ul className="space-y-2">
                {featuredMaker.listings.map((l) => (
                  <li key={l.slug}>
                    <Link
                      href={`/l/${l.slug}`}
                      className="text-sm text-zinc-700 dark:text-zinc-300 hover:text-teal-700"
                    >
                      → {l.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <SponsorSlot slot="sidebar" />

          <section className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-5 text-sm">
            <div className="font-medium mb-1">Are you a builder?</div>
            <p className="text-zinc-600 dark:text-zinc-400 mb-3">
              Show off what you&apos;ve made. Five minutes to publish, free
              during launch.
            </p>
            <Link href="/new" className="text-teal-700 hover:underline">
              Add a build →
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
