"use client";

import { useActionState } from "react";
import { requestSignIn } from "@/app/lib/signin-actions";
import { initialActionState } from "@/app/lib/action-state";

export default function SignInForm() {
  const [state, action, pending] = useActionState(
    requestSignIn,
    initialActionState
  );
  const fieldErr = !state.ok ? state.fieldErrors?.email : undefined;

  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="block text-sm font-medium mb-1">Email</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          aria-invalid={fieldErr ? true : undefined}
          className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-[#4285F4] ${
            fieldErr
              ? "border-rose-500"
              : "border-zinc-300 dark:border-zinc-700"
          }`}
        />
        {fieldErr && (
          <span className="block text-xs text-rose-600 mt-1">{fieldErr}</span>
        )}
      </label>

      {!state.ok && !state.fieldErrors && (
        <div className="text-sm text-rose-600 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg px-3 py-2">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full px-4 py-2.5 rounded-lg bg-[#4285F4] text-white font-medium hover:brightness-110 disabled:opacity-50"
      >
        {pending ? "Sending link…" : "Email me a sign-in link"}
      </button>
      <p className="text-xs text-zinc-500 text-center">
        We&apos;ll send a one-time link. No password, no spam.
      </p>
    </form>
  );
}
