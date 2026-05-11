import Link from "next/link";

export const metadata = {
  title: "Not found · Clinkdeck",
};

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-6 py-20 text-center">
      <div
        className="aspect-video w-full rounded-2xl mb-8 overflow-hidden flex items-center justify-center text-white text-6xl font-semibold tracking-tight"
        style={{
          background:
            "linear-gradient(135deg, #06b6d4, #14b8a6 55%, #22c55e)",
        }}
      >
        404
      </div>
      <h1 className="text-2xl font-semibold tracking-tight mb-2">
        Nothing on this beach.
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-6">
        The build you were looking for isn&apos;t here. Maybe the maker
        unpublished it, or the link was a typo.
      </p>
      <div className="flex justify-center gap-3 text-sm">
        <Link
          href="/"
          className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium"
        >
          Back to discover
        </Link>
        <Link
          href="/new"
          className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700"
        >
          Add your own build →
        </Link>
      </div>
    </div>
  );
}
