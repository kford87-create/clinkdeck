"use client";

import { useActionState } from "react";
import { completeOnboarding } from "@/app/lib/onboarding-actions";
import { initialActionState } from "@/app/lib/action-state";

export default function OnboardingForm({
  defaultName,
  defaultHandle,
}: {
  defaultName: string;
  defaultHandle: string;
}) {
  const [state, action, pending] = useActionState(
    completeOnboarding,
    initialActionState
  );
  const fe = !state.ok ? state.fieldErrors ?? {} : {};

  return (
    <form action={action} className="space-y-4">
      <Field
        label="Your name"
        name="name"
        defaultValue={defaultName}
        placeholder="Jane Builder"
        error={fe.name}
        required
      />
      <Field
        label="Handle"
        name="handle"
        defaultValue={defaultHandle}
        placeholder="janebuilder"
        help="Your URL: clinkdeck.com/c/yourhandle. Letters, numbers, dashes."
        error={fe.handle}
        required
      />
      <Textarea
        label="Bio"
        name="bio"
        rows={3}
        placeholder="What you build, who you work with — 1 to 2 sentences. Skippable."
        error={fe.bio}
      />

      {!state.ok && !state.fieldErrors && (
        <div className="text-sm text-rose-600 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg px-3 py-2">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full px-4 py-2.5 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Continue"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  help,
  error,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  help?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1">
        {label}
        {!required && (
          <span className="text-zinc-400 ml-1 text-xs">(optional)</span>
        )}
      </span>
      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        aria-invalid={error ? true : undefined}
        className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
          error ? "border-rose-500" : "border-zinc-300 dark:border-zinc-700"
        }`}
      />
      {error && (
        <span className="block text-xs text-rose-600 mt-1">{error}</span>
      )}
      {help && !error && (
        <span className="block text-xs text-zinc-500 mt-1">{help}</span>
      )}
    </label>
  );
}

function Textarea({
  label,
  name,
  rows = 3,
  placeholder,
  error,
}: {
  label: string;
  name: string;
  rows?: number;
  placeholder?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1">
        {label}
        <span className="text-zinc-400 ml-1 text-xs">(optional)</span>
      </span>
      <textarea
        name={name}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
          error ? "border-rose-500" : "border-zinc-300 dark:border-zinc-700"
        }`}
      />
      {error && (
        <span className="block text-xs text-rose-600 mt-1">{error}</span>
      )}
    </label>
  );
}
