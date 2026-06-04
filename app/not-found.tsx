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
            "linear-gradient(120deg, #4285F4, #34A853 45%, #FBBC05 70%, #EA4335)",
        }}
      >
        404
      </div>
      <h1 className="text-2xl font-semibold tracking-tight mb-2">
        Page not found.
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-6">
        The page you&apos;re looking for isn&apos;t here — it may have moved, or
        the link was mistyped.
      </p>
      <div className="flex justify-center gap-3 text-sm">
        <Link
          href="/"
          className="px-4 py-2 rounded-lg bg-[#4285F4] text-white font-medium hover:brightness-110"
        >
          Back to home
        </Link>
        <Link
          href="/#chrome"
          className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700"
        >
          Browse products →
        </Link>
      </div>
    </div>
  );
}
