"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "./prisma";
import { getCurrentUser } from "./auth";
import { ARCHETYPES, archetypeSchemas, type Archetype } from "./archetypes";
import { type ActionState, zodToActionState } from "./action-state";

async function requireOwner(listingId: string) {
  const me = await getCurrentUser();
  if (!me) throw new Error("Sign in required");
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: {
      id: true,
      slug: true,
      creatorId: true,
      creator: { select: { handle: true } },
    },
  });
  if (!listing) throw new Error("Listing not found");
  if (listing.creatorId !== me.id)
    throw new Error("You can only modify your own builds");
  return { me, listing };
}

const COLORS = [
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

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : ""));

const baseSchema = z.object({
  title: z.string().trim().min(3).max(120),
  summary: z.string().trim().min(10).max(280),
  builtWith: z.string().trim().min(2).max(120),
  problem: optionalText,
  buildTime: optionalText,
  hardestPart: optionalText,
  archetype: z.enum(ARCHETYPES),
  themeColor: z
    .string()
    .trim()
    .regex(/^#[0-9a-f]{6}$/i)
    .optional(),
  tags: z.string().trim().max(200).optional(),
});

export async function createListing(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const me = await getCurrentUser();
  if (!me) return { ok: false, error: "Sign in to add a build." };
  if (!me.onboarded) return { ok: false, error: "Complete onboarding first." };

  const baseParse = baseSchema.safeParse(Object.fromEntries(formData));
  if (!baseParse.success) return zodToActionState(baseParse.error);
  const base = baseParse.data;

  const labels = extractLabels(base.archetype, formData);
  const labelParse = archetypeSchemas[base.archetype].safeParse(labels);
  if (!labelParse.success) return zodToActionState(labelParse.error);

  const baseSlug = slugify(base.title);
  const themeColor =
    base.themeColor ?? COLORS[Math.floor(Math.random() * COLORS.length)];

  const data = {
    title: base.title,
    summary: base.summary,
    problem: base.problem,
    builtWith: base.builtWith,
    buildTime: base.buildTime,
    hardestPart: base.hardestPart,
    archetype: base.archetype,
    visualLabels: JSON.stringify(labelParse.data),
    themeColor,
    tags: base.tags ?? "",
    creatorId: me.id,
  };

  // Race-safe slug allocation: try the base slug, then suffix on collision.
  // Catches the case where two concurrent creators chose the same title
  // between our check-then-write window.
  let listing;
  for (let attempt = 0; attempt < 50; attempt++) {
    const slug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`;
    try {
      listing = await prisma.listing.create({ data: { ...data, slug } });
      break;
    } catch (e) {
      if (!isUniqueSlugError(e)) throw e;
      // collision — try next suffix
    }
  }
  if (!listing) {
    return { ok: false, error: "Could not allocate a unique slug. Try a different title." };
  }

  revalidatePath("/");
  revalidatePath(`/c/${me.handle}`);
  redirect(`/l/${listing.slug}`);
}

export async function updateListing(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const listingId = formData.get("listingId");
  if (typeof listingId !== "string" || !listingId) {
    return { ok: false, error: "Missing listing ID." };
  }

  let listing;
  try {
    ({ listing } = await requireOwner(listingId));
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }

  const baseParse = baseSchema.safeParse(Object.fromEntries(formData));
  if (!baseParse.success) return zodToActionState(baseParse.error);
  const base = baseParse.data;

  const labels = extractLabels(base.archetype, formData);
  const labelParse = archetypeSchemas[base.archetype].safeParse(labels);
  if (!labelParse.success) return zodToActionState(labelParse.error);

  await prisma.listing.update({
    where: { id: listingId },
    data: {
      title: base.title,
      summary: base.summary,
      problem: base.problem,
      builtWith: base.builtWith,
      buildTime: base.buildTime,
      hardestPart: base.hardestPart,
      archetype: base.archetype,
      visualLabels: JSON.stringify(labelParse.data),
      themeColor: base.themeColor ?? undefined,
      tags: base.tags ?? "",
    },
  });

  revalidatePath("/");
  revalidatePath(`/l/${listing.slug}`);
  redirect(`/l/${listing.slug}`);
}

export async function deleteListing(formData: FormData) {
  const listingId = formData.get("listingId");
  if (typeof listingId !== "string" || !listingId) {
    throw new Error("Missing listingId");
  }
  const { listing } = await requireOwner(listingId);

  await prisma.$transaction([
    prisma.inquiryMessage.deleteMany({ where: { inquiry: { listingId } } }),
    prisma.inquiry.deleteMany({ where: { listingId } }),
    prisma.listing.delete({ where: { id: listingId } }),
  ]);

  revalidatePath("/");
  revalidatePath(`/c/${listing.creator.handle}`);
  redirect(`/c/${listing.creator.handle}`);
}

function extractLabels(archetype: Archetype, formData: FormData) {
  switch (archetype) {
    case "TRIAGE":
      return {
        inputName: formData.get("inputName"),
        signal: formData.get("signal"),
        buckets: parseList(formData.get("buckets")),
      };
    case "PIPELINE":
      return {
        inputName: formData.get("inputName"),
        outputName: formData.get("outputName"),
        steps: parseList(formData.get("steps")),
      };
    case "SCORE_ROUTE":
      return {
        inputName: formData.get("inputName"),
        scoreLabel: formData.get("scoreLabel"),
        tiers: parseList(formData.get("tiers")),
      };
    case "VOICE_LOOP":
      return {
        userSays: formData.get("userSays"),
        agentThinks: formData.get("agentThinks"),
        agentSays: formData.get("agentSays"),
      };
    case "GENERATIVE":
      return {
        promptName: formData.get("promptName"),
        artifactName: formData.get("artifactName"),
        qualitySignal: formData.get("qualitySignal"),
      };
  }
}

function parseList(v: FormDataEntryValue | null) {
  if (!v) return [];
  return String(v)
    .split(/[,·•]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function slugify(title: string) {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "build"
  );
}

function isUniqueSlugError(e: unknown): boolean {
  if (!e || typeof e !== "object") return false;
  const code = (e as { code?: unknown }).code;
  // P2002 = Prisma unique constraint violation. Listing.slug is the only
  // unique field on this model, so any P2002 here is a slug collision.
  return code === "P2002";
}

function errorMessage(e: unknown) {
  return e instanceof Error ? e.message : "Something went wrong.";
}
