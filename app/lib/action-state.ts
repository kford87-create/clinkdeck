/**
 * Shared shape for server-action results that need to surface validation
 * errors back to the form. Used with React's useActionState.
 */
export type ActionState =
  | { ok: true; message?: string }
  | {
      ok: false;
      error: string;
      fieldErrors?: Record<string, string>;
    };

export const initialActionState: ActionState = { ok: true };

import { z } from "zod";

/**
 * Convert a Zod error into the ActionState shape so forms can display
 * per-field messages and a top-level summary.
 */
export function zodToActionState(err: z.ZodError): ActionState {
  const fieldErrors: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = issue.path.map(String).join(".") || "_form";
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return {
    ok: false,
    error: "Please fix the highlighted fields.",
    fieldErrors,
  };
}
