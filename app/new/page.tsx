import { requireOnboardedUser } from "@/app/lib/auth";
import ListingWizard from "@/app/components/ListingWizard";
import { createListing } from "@/app/lib/listing-actions";

export default async function NewListing() {
  // Redirects to /signin if not signed in, or /onboarding if not yet onboarded.
  await requireOnboardedUser();

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Show what you built
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          Five minutes. We&apos;ll turn your description into an animated
          visual on your listing.
        </p>
      </div>
      <ListingWizard action={createListing} />
    </div>
  );
}
