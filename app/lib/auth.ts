import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, randomBytes } from "node:crypto";
import { prisma } from "./prisma";

const SESSION_COOKIE = "clinkdeck_session";
const SESSION_TTL_DAYS = 30;
const MAGIC_LINK_TTL_MINUTES = 15;

/**
 * Reads the current session cookie and returns the signed-in user, or null.
 * Sliding expiration: each lookup updates lastUsedAt so active users don't get
 * logged out by short sessions.
 */
export async function getCurrentUser() {
  const store = await cookies();
  const sessionId = store.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });
  if (!session) return null;
  if (session.expiresAt < new Date()) {
    // Cleanup the stale row best-effort; cookie is invalid either way.
    await prisma.session
      .delete({ where: { id: session.id } })
      .catch(() => null);
    return null;
  }

  // Sliding expiration — only update if at least an hour has passed
  // to avoid hammering the DB on every request.
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
  if (session.lastUsedAt < hourAgo) {
    await prisma.session.update({
      where: { id: session.id },
      data: { lastUsedAt: new Date() },
    });
  }
  return session.user;
}

/**
 * For pages that require a fully-onboarded user (handle + name + bio).
 * Use this in pages that gate behavior behind a finished profile —
 * /new, /settings, etc. Public-read pages (creator profiles, listing
 * details) should call getCurrentUser directly instead.
 */
export async function requireOnboardedUser() {
  const me = await getCurrentUser();
  if (!me) redirect("/signin");
  if (!me.onboarded) redirect("/onboarding");
  return me;
}

export async function createSession(userId: string, userAgent?: string) {
  const expiresAt = new Date(
    Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000
  );
  const session = await prisma.session.create({
    data: { userId, expiresAt, userAgent: userAgent?.slice(0, 200) ?? null },
  });
  const store = await cookies();
  store.set(SESSION_COOKIE, session.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
  });
  return session;
}

export async function clearSession() {
  const store = await cookies();
  const sessionId = store.get(SESSION_COOKIE)?.value;
  store.delete(SESSION_COOKIE);
  if (sessionId) {
    await prisma.session.delete({ where: { id: sessionId } }).catch(() => null);
  }
}

/**
 * Generate a single-use magic link for an email.
 * - Token is 32 bytes from CSPRNG, base64url encoded (~43 chars)
 * - Stored as SHA-256 hash so DB compromise doesn't reveal active links
 * - 15-minute expiry
 */
export async function issueMagicLink(email: string) {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = sha256Hex(token);
  const expiresAt = new Date(Date.now() + MAGIC_LINK_TTL_MINUTES * 60 * 1000);
  await prisma.magicLink.create({
    data: { tokenHash, email: email.toLowerCase(), expiresAt },
  });
  return { token, expiresAt };
}

/**
 * Validate a magic link token. Returns the email it was issued for, or null
 * if invalid/expired/already-used. Atomically marks the token used to prevent
 * race conditions on rapid double-clicks.
 */
export async function consumeMagicLink(token: string): Promise<string | null> {
  const tokenHash = sha256Hex(token);
  const link = await prisma.magicLink.findUnique({ where: { tokenHash } });
  if (!link) return null;
  if (link.usedAt) return null;
  if (link.expiresAt < new Date()) return null;

  // Atomic single-use guard: updateMany with usedAt=null filter.
  const result = await prisma.magicLink.updateMany({
    where: { tokenHash, usedAt: null },
    data: { usedAt: new Date() },
  });
  if (result.count !== 1) return null;
  return link.email;
}

function sha256Hex(input: string) {
  return createHash("sha256").update(input).digest("hex");
}
