import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import type { InquiryStatus } from "@/app/lib/types";
import StatusBadge from "@/app/components/StatusBadge";
import ReplyForm from "@/app/components/ReplyForm";

export default async function InquiryThread(
  props: PageProps<"/inquiries/[id]">
) {
  const me = await getCurrentUser();
  if (!me) redirect("/");
  const { id } = await props.params;
  const inquiry = await prisma.inquiry.findUnique({
    where: { id },
    include: {
      listing: { select: { slug: true, title: true } },
      buyer: true,
      creator: true,
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: true },
      },
    },
  });
  if (!inquiry) notFound();
  if (me.id !== inquiry.buyerId && me.id !== inquiry.creatorId) {
    redirect("/");
  }
  const isCreator = me.id === inquiry.creatorId;
  const counterpart = isCreator ? inquiry.buyer : inquiry.creator;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Link
        href="/inquiries"
        className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
      >
        ← All inquiries
      </Link>

      <div className="mt-3 mb-6">
        <div className="flex items-baseline justify-between gap-3">
          <h1 className="text-xl font-semibold tracking-tight">
            {inquiry.subject}
          </h1>
          <StatusBadge status={inquiry.status as InquiryStatus} />
        </div>
        <div className="text-sm text-zinc-500 mt-1">
          {isCreator ? (
            <>
              From <strong className="text-zinc-700 dark:text-zinc-300">{inquiry.buyer.name}</strong>
            </>
          ) : (
            <>
              To <strong className="text-zinc-700 dark:text-zinc-300">{inquiry.creator.name}</strong>
            </>
          )}{" "}
          ·{" "}
          <Link
            href={`/l/${inquiry.listing.slug}`}
            className="hover:text-teal-700"
          >
            {inquiry.listing.title}
          </Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-6 text-sm">
        <KeyValue label="Budget" value={inquiry.budget} />
        <KeyValue label="Timeline" value={inquiry.timeline} />
        <KeyValue label="Sent" value={inquiry.createdAt.toLocaleDateString()} />
      </div>

      {isCreator && (
        <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-4 mb-6">
          <div className="text-xs uppercase tracking-wider text-zinc-500 mb-2">
            About the buyer
          </div>
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-full"
              style={{ background: inquiry.buyer.avatarColor }}
            />
            <div>
              <div className="font-semibold">{inquiry.buyer.name}</div>
              <div className="text-xs text-zinc-500">@{inquiry.buyer.handle}</div>
            </div>
          </div>
          {inquiry.buyer.bio && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3">
              {inquiry.buyer.bio}
            </p>
          )}
        </section>
      )}

      <ul className="space-y-3 mb-6">
        {inquiry.messages.map((m) => {
          const mine = m.senderId === me.id;
          return (
            <li
              key={m.id}
              className={`max-w-[80%] ${mine ? "ml-auto" : ""}`}
            >
              <div
                className={`rounded-2xl px-4 py-3 text-sm whitespace-pre-line ${
                  mine
                    ? "bg-teal-600 text-white"
                    : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
                }`}
              >
                {m.body}
              </div>
              <div
                className={`text-[10px] text-zinc-500 mt-1 px-2 ${
                  mine ? "text-right" : ""
                }`}
              >
                {m.sender.name} · {m.createdAt.toLocaleString()}
              </div>
            </li>
          );
        })}
      </ul>

      <ReplyForm inquiryId={inquiry.id} counterpartName={counterpart.name} />
    </div>
  );
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="font-medium text-sm">{value}</div>
    </div>
  );
}
