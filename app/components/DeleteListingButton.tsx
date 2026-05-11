"use client";

import { deleteListing } from "@/app/lib/listing-actions";

export default function DeleteListingButton({
  listingId,
  listingTitle,
}: {
  listingId: string;
  listingTitle: string;
}) {
  return (
    <form
      action={deleteListing}
      onSubmit={(e) => {
        const confirmed = confirm(
          `Delete "${listingTitle}"? This removes the listing and all of its inquiries. This cannot be undone.`
        );
        if (!confirmed) e.preventDefault();
      }}
    >
      <input type="hidden" name="listingId" value={listingId} />
      <button
        type="submit"
        className="px-3 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-rose-600"
      >
        Delete
      </button>
    </form>
  );
}
