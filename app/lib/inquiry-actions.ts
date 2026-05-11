"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "./prisma";
import { getCurrentUser } from "./auth";
import { sendInquiryEmail } from "./email";
import { rateLimit } from "./rate-limit";
import { type ActionState, zodToActionState } from "./action-state";

const inquirySchema = z.object({
  listingId: z.string().min(1).max(40),
  subject: z.string().trim().min(3).max(140),
  budget: z.string().trim().min(1).max(60),
  timeline: z.string().trim().min(1).max(60),
  goal: z.string().trim().min(10).max(5000),
});

const INQUIRY_LIMIT = 10; // per buyer per hour
const INQUIRY_WINDOW_MS = 60 * 60 * 1000;

export async function sendInquiry(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const me = await getCurrentUser();
  if (!me) return { ok: false, error: "Sign in to send an inquiry." };
  if (!me.onboarded) return { ok: false, error: "Complete onboarding first." };

  const limited = rateLimit(
    `inquiry:${me.id}`,
    INQUIRY_LIMIT,
    INQUIRY_WINDOW_MS
  );
  if (!limited.ok) {
    return {
      ok: false,
      error: "You've sent a lot of inquiries lately. Try again in a bit.",
    };
  }

  const parsed = inquirySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return zodToActionState(parsed.error);

  const listing = await prisma.listing.findUnique({
    where: { id: parsed.data.listingId },
    select: { creatorId: true, slug: true, title: true, creator: true },
  });
  if (!listing) return { ok: false, error: "That build no longer exists." };
  if (listing.creatorId === me.id) {
    return { ok: false, error: "You can't inquire on your own build." };
  }

  const inquiry = await prisma.inquiry.create({
    data: {
      listingId: parsed.data.listingId,
      buyerId: me.id,
      creatorId: listing.creatorId,
      subject: parsed.data.subject,
      budget: parsed.data.budget,
      timeline: parsed.data.timeline,
      goal: parsed.data.goal,
      messages: {
        create: { senderId: me.id, body: parsed.data.goal },
      },
    },
  });

  await sendInquiryEmail({
    creatorEmail: listing.creator.email,
    creatorName: listing.creator.name,
    creatorHandle: listing.creator.handle,
    buyerName: me.name,
    listingTitle: listing.title,
    subject: parsed.data.subject,
    budget: parsed.data.budget,
    timeline: parsed.data.timeline,
    goal: parsed.data.goal,
    inquiryId: inquiry.id,
  });

  revalidatePath(`/l/${listing.slug}`);
  redirect(`/inquiries/${inquiry.id}`);
}

const messageSchema = z.object({
  inquiryId: z.string().min(1).max(40),
  body: z.string().trim().min(1).max(5000),
});

export async function postMessage(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const me = await getCurrentUser();
  if (!me) return { ok: false, error: "Sign in to reply." };

  const parsed = messageSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return zodToActionState(parsed.error);

  const inquiry = await prisma.inquiry.findUnique({
    where: { id: parsed.data.inquiryId },
    select: { buyerId: true, creatorId: true, status: true },
  });
  if (!inquiry) return { ok: false, error: "Conversation not found." };
  if (me.id !== inquiry.buyerId && me.id !== inquiry.creatorId) {
    return { ok: false, error: "Not your conversation." };
  }

  await prisma.inquiryMessage.create({
    data: {
      inquiryId: parsed.data.inquiryId,
      senderId: me.id,
      body: parsed.data.body,
    },
  });

  if (me.id === inquiry.creatorId && inquiry.status === "NEW") {
    await prisma.inquiry.update({
      where: { id: parsed.data.inquiryId },
      data: { status: "REPLIED" },
    });
  }

  revalidatePath(`/inquiries/${parsed.data.inquiryId}`);
  revalidatePath("/inquiries");
  return { ok: true };
}
