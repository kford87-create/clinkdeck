import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import ListingWizard, {
  type WizardDefaults,
} from "@/app/components/ListingWizard";
import { updateListing } from "@/app/lib/listing-actions";
import { type Archetype } from "@/app/lib/archetypes";

export default async function EditListing(
  props: PageProps<"/l/[slug]/edit">
) {
  const { slug } = await props.params;
  const me = await getCurrentUser();
  if (!me) redirect(`/l/${slug}`);

  const listing = await prisma.listing.findUnique({ where: { slug } });
  if (!listing) notFound();
  if (listing.creatorId !== me.id) redirect(`/l/${slug}`);

  const defaults: WizardDefaults = {
    listingId: listing.id,
    title: listing.title,
    summary: listing.summary,
    problem: listing.problem,
    builtWith: listing.builtWith,
    buildTime: listing.buildTime,
    hardestPart: listing.hardestPart,
    tags: listing.tags,
    archetype: listing.archetype as Archetype,
    themeColor: listing.themeColor,
    labels: parseStoredLabels(listing.visualLabels),
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-6">
        <Link
          href={`/l/${slug}`}
          className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
        >
          ← Back to listing
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight mt-2">
          Edit your build
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          Changes save back to the same URL. Slug stays the same so existing
          links keep working.
        </p>
      </div>
      <ListingWizard
        action={updateListing}
        defaults={defaults}
        submitLabel="Save changes"
        cancelHref={`/l/${slug}`}
      />
    </div>
  );
}

/**
 * Convert the JSON-encoded label object back into the FormState shape
 * (string-valued) the wizard expects. Lists become comma-separated strings.
 */
function parseStoredLabels(json: string): Record<string, string> {
  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(json);
  } catch {
    return {};
  }
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (Array.isArray(value)) {
      out[key] = value.map((v) => String(v)).join(", ");
    } else if (value != null) {
      out[key] = String(value);
    }
  }
  return out;
}
