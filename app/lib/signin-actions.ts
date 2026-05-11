"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "./prisma";
import {
  clearSession,
  issueMagicLink,
} from "./auth";
import { sendMagicLinkEmail } from "./email";
import { rateLimit } from "./rate-limit";
import {
  type ActionState,
  zodToActionState,
} from "./action-state";

const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(3)
    .max(254)
    .email("That doesn't look like an email address."),
});

const SIGNIN_LIMIT = 5; // requests per 15 minutes per email/ip
const SIGNIN_WINDOW_MS = 15 * 60 * 1000;

export async function requestSignIn(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = emailSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return zodToActionState(parsed.error);

  const { email } = parsed.data;
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerList.get("x-real-ip") ??
    "unknown";

  // Two limiters: one per email (so a single inbox can't be spammed), one per
  // IP (so one attacker can't enumerate emails across many addresses).
  for (const key of [`signin:email:${email}`, `signin:ip:${ip}`]) {
    const limited = rateLimit(key, SIGNIN_LIMIT, SIGNIN_WINDOW_MS);
    if (!limited.ok) {
      return {
        ok: false,
        error: "Too many sign-in attempts. Try again in a few minutes.",
      };
    }
  }

  // Always behave the same whether or not the user exists yet — sign-up and
  // sign-in are the same flow. We create the user record on first verify, not
  // here, so this endpoint never reveals account existence.
  const { token } = await issueMagicLink(email);
  const baseUrl = appUrl();
  const link = `${baseUrl}/auth/verify?token=${encodeURIComponent(token)}`;

  await sendMagicLinkEmail({ to: email, link, appUrl: baseUrl });

  redirect(`/signin/sent?email=${encodeURIComponent(email)}`);
}

export async function signOut() {
  await clearSession();
  redirect("/");
}

/**
 * Used by the verify route handler after consumeMagicLink succeeds.
 * Finds an existing user by email or creates a new one with a placeholder
 * handle that the onboarding flow will replace.
 *
 * Guarded against the concurrent-create race: two simultaneous first-time
 * verifies for the same email could both pass the findUnique check; the
 * loser of the unique-constraint race is handled by re-fetching.
 */
export async function findOrCreateUser(email: string) {
  const lowercased = email.toLowerCase();
  const existing = await prisma.user.findUnique({
    where: { email: lowercased },
  });
  if (existing) return existing;

  const handle = await uniqueHandleFromEmail(lowercased);
  try {
    return await prisma.user.create({
      data: {
        email: lowercased,
        handle,
        name: prettyNameFromEmail(lowercased),
        onboarded: false,
      },
    });
  } catch {
    // Almost certainly a unique-constraint violation from a concurrent
    // first-verify. Re-fetch and return whichever record won.
    const winner = await prisma.user.findUnique({
      where: { email: lowercased },
    });
    if (winner) return winner;
    throw new Error("Could not create or load user account.");
  }
}

async function uniqueHandleFromEmail(email: string) {
  const base = email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
  const candidate = base || "maker";
  if (!(await prisma.user.findUnique({ where: { handle: candidate } }))) {
    return candidate;
  }
  // Append random suffix to avoid leaking how many users share a handle.
  for (let i = 0; i < 5; i++) {
    const suffix = Math.random().toString(36).slice(2, 6);
    const next = `${candidate}-${suffix}`;
    if (!(await prisma.user.findUnique({ where: { handle: next } }))) {
      return next;
    }
  }
  // Fallback to cuid suffix
  return `${candidate}-${Math.random().toString(36).slice(2, 8)}`;
}

function prettyNameFromEmail(email: string) {
  const local = email.split("@")[0];
  return local
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .slice(0, 60);
}

function appUrl() {
  const fromEnv = process.env.APP_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.NODE_ENV === "production") {
    throw new Error("APP_URL is not set in production.");
  }
  return "http://localhost:3000";
}
