import Link from "next/link";

export default async function SignInSent(props: PageProps<"/signin/sent">) {
  const sp = await props.searchParams;
  const email = typeof sp.email === "string" ? sp.email : null;

  return (
    <div className="max-w-md mx-auto px-6 py-16 text-center">
      <div className="h-14 w-14 rounded-full bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center mx-auto mb-4 text-2xl">
        ✉️
      </div>
      <h1 className="text-2xl font-semibold tracking-tight mb-2">
        Check your inbox
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        {email ? (
          <>
            We sent a sign-in link to{" "}
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {email}
            </span>
            . The link is good for 15 minutes.
          </>
        ) : (
          <>
            We sent you a sign-in link. The link is good for 15 minutes.
          </>
        )}
      </p>
      <p className="text-xs text-zinc-500 mt-6">
        Didn&apos;t see it?{" "}
        <Link
          href="/signin"
          className="text-teal-700 hover:underline"
        >
          Try again
        </Link>
        .
      </p>
    </div>
  );
}
