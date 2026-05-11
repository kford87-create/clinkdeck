import { pickSponsor, type Sponsor } from "@/app/lib/sponsors";

export default function SponsorSlot({ slot }: { slot: Sponsor["slot"] }) {
  const sponsor = pickSponsor(slot);
  if (!sponsor) return null;

  return (
    <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] uppercase tracking-wider text-zinc-500">
          Sponsored
        </span>
      </div>
      <a
        href={sponsor.ctaUrl}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="flex items-center gap-3 mb-3 group"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={sponsor.logoUrl}
          alt={`${sponsor.name} logo`}
          className="h-10 w-10 rounded-md object-contain bg-zinc-100 dark:bg-zinc-800"
        />
        <div className="font-semibold group-hover:text-teal-700">
          {sponsor.name}
        </div>
      </a>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
        {sponsor.copy}
      </p>
      <a
        href={sponsor.ctaUrl}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="text-sm text-teal-700 hover:underline"
      >
        Learn more →
      </a>
    </section>
  );
}
