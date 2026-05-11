import Link from "next/link";
import { ARCHETYPE_META, type Archetype } from "@/app/lib/archetypes";
import Visual from "@/app/components/visuals/Visual";

type CardListing = {
  slug: string;
  title: string;
  summary: string;
  themeColor: string;
  archetype: string;
  visualLabels: string;
  featuredUntil?: Date | string | null;
  creator: {
    handle: string;
    name: string;
    avatarColor: string;
  };
};

export default function ListingCard({ listing }: { listing: CardListing }) {
  const archetypeName =
    ARCHETYPE_META[listing.archetype as Archetype]?.name ?? null;
  const isFeatured =
    listing.featuredUntil != null &&
    new Date(listing.featuredUntil).getTime() > Date.now();
  return (
    <Link
      href={`/l/${listing.slug}`}
      className="group block rounded-xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
    >
      <div className="relative">
        <Visual
          archetype={listing.archetype}
          visualLabels={listing.visualLabels}
          themeColor={listing.themeColor}
        />
        {isFeatured && (
          <div className="absolute top-2 left-2 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/90 text-zinc-900 font-semibold z-10">
            Featured
          </div>
        )}
        {archetypeName && (
          <div className="absolute top-2 right-2 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/40 text-white font-medium backdrop-blur z-10">
            {archetypeName}
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-start gap-2">
          <div
            className="h-8 w-8 rounded-full flex-shrink-0 mt-0.5"
            style={{ background: listing.creator.avatarColor }}
          />
          <div className="min-w-0">
            <div className="font-semibold text-sm leading-tight group-hover:text-teal-700">
              {listing.title}
            </div>
            <div className="text-xs text-zinc-500 mt-0.5 line-clamp-2">
              {listing.summary}
            </div>
            <div className="text-xs text-zinc-500 mt-1">
              by {listing.creator.name}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
