"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "./prisma";
import { getCurrentUser } from "./auth";
import {
  type ActionState,
  zodToActionState,
} from "./action-state";

const schema = z.object({
  name: z.string().trim().min(2).max(60),
  handle: z
    .string()
    .trim()
    .toLowerCase()
    .min(2)
    .max(30)
    .regex(/^[a-z0-9-]+$/, "Letters, numbers, and dashes only"),
  bio: z.string().trim().max(280).optional(),
});

const RESERVED = new Set([
  "admin",
  "api",
  "auth",
  "c",
  "category",
  "inquiries",
  "l",
  "new",
  "onboarding",
  "settings",
  "signin",
  "signout",
  "sign-in",
  "sign-out",
]);

export async function completeOnboarding(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const me = await getCurrentUser();
  if (!me) return { ok: false, error: "Sign in first." };

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return zodToActionState(parsed.error);

  const { name, handle, bio } = parsed.data;

  if (RESERVED.has(handle)) {
    return {
      ok: false,
      error: "That handle is reserved. Try another one.",
      fieldErrors: { handle: "That handle is reserved." },
    };
  }

  if (handle !== me.handle) {
    const taken = await prisma.user.findUnique({ where: { handle } });
    if (taken && taken.id !== me.id) {
      return {
        ok: false,
        error: "That handle is taken.",
        fieldErrors: { handle: "Already taken — try another." },
      };
    }
  }

  try {
    await prisma.user.update({
      where: { id: me.id },
      data: {
        name,
        handle,
        bio: bio || null,
        onboarded: true,
      },
    });
  } catch {
    // Race: handle was taken between our check and this write.
    return {
      ok: false,
      error: "That handle was just taken — try another.",
      fieldErrors: { handle: "Just taken — try another." },
    };
  }

  revalidatePath("/", "layout");
  redirect(`/c/${handle}`);
}
