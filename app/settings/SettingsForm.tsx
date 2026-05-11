"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { updateProfile } from "@/app/lib/profile-actions";
import { initialActionState } from "@/app/lib/action-state";

const COLOR_PALETTE = [
  "#f43f5e",
  "#ec4899",
  "#a855f7",
  "#8b5cf6",
  "#0ea5e9",
  "#06b6d4",
  "#10b981",
  "#22c55e",
  "#eab308",
  "#f97316",
];

export default function SettingsForm({
  defaults,
}: {
  defaults: {
    name: string;
    handle: string;
    bio: string;
    avatarColor: string;
    websiteUrl: string;
    calLink: string;
  };
}) {
  const [state, action, pending] = useActionState(
    updateProfile,
    initialActionState
  );
  const fe = !state.ok ? state.fieldErrors ?? {} : {};
  const [color, setColor] = useState(defaults.avatarColor);

  return (
    <form action={action} className="space-y-5">
      {!state.ok && state.error && (
        <div className="text-sm text-rose-600 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg px-3 py-2">
          {state.error}
        </div>
      )}

      <Field label="Name" name="name" defaultValue={defaults.name} required error={fe.name} />
      <Field
        label="Handle"
        name="handle"
        defaultValue={defaults.handle}
        help="Your URL: clinkdeck.com/c/yourhandle. Letters, numbers and dashes."
        required
        error={fe.handle}
      />
      <Textarea
        label="Bio"
        name="bio"
        defaultValue={defaults.bio}
        rows={3}
        placeholder="What you build, who you work with, anything you want a buyer to know in 1–2 sentences."
        error={fe.bio}
      />

      <input type="hidden" name="avatarColor" value={color} />
      <div>
        <span className="block text-sm font-medium mb-2">Avatar color</span>
        <div className="flex flex-wrap gap-2">
          {COLOR_PALETTE.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setColor(c)}
              aria-label={`Color ${c}`}
              className={`h-9 w-9 rounded-full ring-2 transition-all ${
                c.toLowerCase() === color.toLowerCase()
                  ? "ring-zinc-900 dark:ring-white"
                  : "ring-transparent"
              }`}
              style={{ background: c }}
            />
          ))}
        </div>
      </div>

      <Field
        label="Website"
        name="websiteUrl"
        defaultValue={defaults.websiteUrl}
        placeholder="https://yourname.com"
        error={fe.websiteUrl}
      />
      <Field
        label="Booking link"
        name="calLink"
        defaultValue={defaults.calLink}
        placeholder="https://cal.com/yourname"
        help="Cal.com or Calendly. Adds a 'Book a discovery call' button to your profile."
        error={fe.calLink}
      />

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="px-5 py-2.5 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save profile"}
        </button>
        <Link
          href={`/c/${defaults.handle}`}
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  help,
  required,
  error,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  help?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1">
        {label}
        {!required && <span className="text-zinc-400 ml-1 text-xs">(optional)</span>}
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
      {error && <span className="block text-xs text-rose-600 mt-1">{error}</span>}
      {help && !error && <span className="block text-xs text-zinc-500 mt-1">{help}</span>}
    </label>
  );
}

function Textarea({
  label,
  name,
  defaultValue,
  placeholder,
  rows = 3,
  error,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
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
        defaultValue={defaultValue}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
          error ? "border-rose-500" : "border-zinc-300 dark:border-zinc-700"
        }`}
      />
      {error && <span className="block text-xs text-rose-600 mt-1">{error}</span>}
    </label>
  );
}
