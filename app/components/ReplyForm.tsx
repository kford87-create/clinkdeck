"use client";

import { useActionState, useEffect, useRef } from "react";
import { postMessage } from "@/app/lib/inquiry-actions";
import { initialActionState } from "@/app/lib/action-state";

export default function ReplyForm({
  inquiryId,
  counterpartName,
}: {
  inquiryId: string;
  counterpartName: string;
}) {
  const [state, action, pending] = useActionState(
    postMessage,
    initialActionState
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the textarea after a successful send.
  useEffect(() => {
    if (state.ok && !pending && formRef.current) {
      formRef.current.reset();
    }
  }, [state, pending]);

  const fe = !state.ok ? state.fieldErrors ?? {} : {};

  return (
    <form
      ref={formRef}
      action={action}
      className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4"
    >
      <input type="hidden" name="inquiryId" value={inquiryId} />
      <textarea
        name="body"
        rows={3}
        required
        maxLength={5000}
        placeholder={`Reply to ${counterpartName}…`}
        aria-invalid={fe.body ? true : undefined}
        className={`w-full px-3 py-2 rounded-lg border bg-zinc-50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
          fe.body ? "border-rose-500" : "border-zinc-300 dark:border-zinc-700"
        }`}
      />
      {!state.ok && state.error && (
        <div className="text-xs text-rose-600 mt-1">{state.error}</div>
      )}
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-1.5 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 disabled:opacity-50"
        >
          {pending ? "Sending…" : "Send"}
        </button>
      </div>
    </form>
  );
}
