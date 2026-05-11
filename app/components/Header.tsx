import Link from "next/link";
import { getCurrentUser } from "@/app/lib/auth";
import { signOut } from "@/app/lib/signin-actions";

export default async function Header() {
  const me = await getCurrentUser();

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4 sm:gap-6">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="h-7 w-7 rounded-md bg-gradient-to-br from-cyan-500 to-teal-600" />
          <span className="font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Clinkdeck
          </span>
        </Link>
        <div className="flex-1" />
        {me ? (
          <>
            <Link
              href="/new"
              className="text-sm text-zinc-700 dark:text-zinc-300 hover:underline hidden sm:inline"
            >
              + New build
            </Link>
            <Link
              href="/inquiries"
              className="text-sm text-zinc-700 dark:text-zinc-300 hover:underline"
            >
              Inquiries
            </Link>
            <Link
              href="/settings"
              className="text-sm text-zinc-700 dark:text-zinc-300 hover:underline hidden sm:inline"
            >
              Settings
            </Link>
            <Link
              href={`/c/${me.handle}`}
              className="text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:underline truncate max-w-[14ch] sm:max-w-none"
            >
              {me.name}
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="text-xs text-zinc-500 hover:text-rose-600"
              >
                Sign out
              </button>
            </form>
          </>
        ) : (
          <Link
            href="/signin"
            className="text-sm font-medium px-3 py-1.5 rounded-md bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:opacity-90"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
