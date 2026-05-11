import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import SignInForm from "./SignInForm";

export default async function SignIn(props: PageProps<"/signin">) {
  const me = await getCurrentUser();
  if (me) redirect(me.onboarded ? "/" : "/onboarding");

  const sp = await props.searchParams;
  const errorCode = typeof sp.error === "string" ? sp.error : null;
  const errorMessage = mapError(errorCode);

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Sign in to Clinkdeck
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          New here? Same form — your account gets created on first link click.
        </p>
      </div>

      {errorMessage && (
        <div className="text-sm text-rose-600 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg px-3 py-2 mb-4">
          {errorMessage}
        </div>
      )}

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
        <SignInForm />
      </div>

      <p className="text-xs text-zinc-500 text-center mt-4">
        <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-200">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}

function mapError(code: string | null) {
  switch (code) {
    case "missing-token":
      return "Sign-in link was malformed. Try again.";
    case "invalid-token":
      return "That sign-in link is invalid, expired, or already used. Email yourself a fresh one.";
    default:
      return null;
  }
}
