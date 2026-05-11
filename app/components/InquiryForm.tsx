"use client";

import { useActionState } from "react";
import { sendInquiry } from "@/app/lib/inquiry-actions";
import { initialActionState } from "@/app/lib/action-state";
import { BUDGETS, TIMELINES } from "@/app/lib/types";

export default function InquiryForm({
  listingId,
  defaultSubject,
}: {
  listingId: string;
  defaultSubject: string;
}) {
  const [state, action, pending] = useActionState(
    sendInquiry,
    initialActionState
  );
  const fe = !state.ok ? state.fieldErrors ?? {} : {};

  return (
    <section className="rounded-xl border-2 border-teal-500 bg-white dark:bg-zinc-900 p-5">
      <div className="font-semibold mb-1">Contact the maker</div>
      <p className="text-sm text-zinc-500 mb-4">
        Drop the maker a note. They&apos;ll see your profile before replying.
      </p>
      <form action={action} className="space-y-3">
        <input type="hidden" name="listingId" value={listingId} />

        {!state.ok && state.error && (
          <div className="text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg px-3 py-2">
            {state.error}
          </div>
        )}

        <Field
          label="Subject"
          name="subject"
          defaultValue={defaultSubject}
          error={fe.subject}
        />
        <Select label="Budget range" name="budget" options={BUDGETS} error={fe.budget} />
        <Select label="Timeline" name="timeline" options={TIMELINES} error={fe.timeline} />
        <Textarea
          label="What do you want to build?"
          name="goal"
          placeholder="Briefly describe what you'd like to build, the problem you're solving, and any specific requirements."
          rows={5}
          error={fe.goal}
        />
        <button
          type="submit"
          disabled={pending}
          className="w-full px-4 py-2.5 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 disabled:opacity-50"
        >
          {pending ? "Sending…" : "Send inquiry"}
        </button>
      </form>
    </section>
  );
}

function Field({
  label,
  name,
  defaultValue,
  error,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium mb-1">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        required
        aria-invalid={error ? true : undefined}
        className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
          error ? "border-rose-500" : "border-zinc-300 dark:border-zinc-700"
        }`}
      />
      {error && <span className="block text-xs text-rose-600 mt-1">{error}</span>}
    </label>
  );
}

function Select({
  label,
  name,
  options,
  error,
}: {
  label: string;
  name: string;
  options: readonly string[];
  error?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium mb-1">{label}</span>
      <select
        name={name}
        required
        aria-invalid={error ? true : undefined}
        className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-zinc-950 text-sm ${
          error ? "border-rose-500" : "border-zinc-300 dark:border-zinc-700"
        }`}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && <span className="block text-xs text-rose-600 mt-1">{error}</span>}
    </label>
  );
}

function Textarea({
  label,
  name,
  placeholder,
  rows = 4,
  error,
}: {
  label: string;
  name: string;
  placeholder?: string;
  rows?: number;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium mb-1">{label}</span>
      <textarea
        name={name}
        rows={rows}
        placeholder={placeholder}
        required
        aria-invalid={error ? true : undefined}
        className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
          error ? "border-rose-500" : "border-zinc-300 dark:border-zinc-700"
        }`}
      />
      {error && <span className="block text-xs text-rose-600 mt-1">{error}</span>}
    </label>
  );
}
